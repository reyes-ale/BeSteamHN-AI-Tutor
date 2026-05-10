import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { ArrowLeft, Bot, CheckCircle2, Circle, Clock, Coins, FileVideo, Gamepad2, PlayCircle, Presentation, Puzzle, Signal, Pencil, Trash2, Users, Trophy, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GameCard from '@/components/games/GameCard';
import { canManageCourse, getCompletedModuleCount, getCourseById, getCourseModuleCount, getProgressForCourse, getProgressPercent, deleteSharedCourse, saveProgressForCourse } from '@/lib/courseProgress';
import type { CourseModule } from '@/lib/mockData';
import type { GameId } from '@/types/games';
import { supabase } from '@/lib/supabase';
import { addNotification } from '@/lib/notifications';
import idl from '@/idl/idl.json';

// CONFIGURACIÓN - ACTUALIZA ESTO CON TUS DIRECCIONES
const PROGRAM_ID = new PublicKey("Agm9NHABSZkPx2kZWwKxxnLDf1RNrFnAfBSerkvsfdnY");

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  
  const course = id ? getCourseById(id) : undefined;
  const [progress, setProgress] = useState(() => (id ? getProgressForCourse(id) : null));
  const [enrolled, setEnrolled] = useState(() => !!progress && (progress.completedModules.length > 0 || progress.gameCompleted));
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [rewardResult, setRewardResult] = useState<{ steamMinted: boolean; txSignature?: string } | null>(null);

  const modules = useMemo(() => {
    if (!course) return [];
    if (course.modules?.length) return course.modules;
    return Array.from({ length: course.lessons }, (_, i) => ({
      id: `lesson-${i + 1}`,
      type: 'lesson' as const,
      title: { en: `Lesson ${i + 1}`, es: `Leccion ${i + 1}` },
      description: { en: 'Complete this activity', es: 'Completa esta actividad' },
    }));
  }, [course]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">{t.common.noResults}</p>
        <Link to="/courses" className="mt-4 text-sm text-secondary hover:underline">{t.common.back}</Link>
      </div>
    );
  }

  const title = locale === 'es' ? course.title.es : course.title.en;
  const desc = locale === 'es' ? course.description.es : course.description.en;
  const diffLabel = t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty;
  const canEdit = canManageCourse(course, user);
  const totalModules = getCourseModuleCount(course);
  const completedCount = progress ? getCompletedModuleCount(course, progress) : 0;
  const progressPct = progress ? getProgressPercent(course, progress) : 0;
  const currentModule = modules.find((module) => !progress?.completedModules.includes(module.id)) ?? modules[0];

  // Registrar usuario en la blockchain si no existe
const registerUserIfNeeded = async () => {
  if (!publicKey || !signTransaction) return false;
  
  try {
    const anchorWallet = {
      publicKey,
      signTransaction,
      signAllTransactions: async (txs: any[]) => {
        const signed = [];
        for (const tx of txs) {
          signed.push(await signTransaction(tx));
        }
        return signed;
      }
    };

    const provider = new AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
    const program = new Program(idl as any, PROGRAM_ID, provider);

    const [studentPda] = await PublicKey.findProgramAddress(
      [Buffer.from("student"), publicKey.toBuffer()],
      PROGRAM_ID
    );

    // Verificar si ya existe la cuenta
    const accountInfo = await connection.getAccountInfo(studentPda);
    
    if (accountInfo !== null) {
      console.log("✅ Usuario ya registrado en blockchain");
      return true;
    }

    console.log("📝 Registrando usuario en blockchain...");
    
    await program.methods
      .registerUser(user?.name || "Student")
      .accounts({
        user: publicKey,
        studentAccount: studentPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Usuario registrado exitosamente");
    return true;

  } catch (error) {
    console.error("❌ Error registrando usuario:", error);
    return false;
  }
};

const handleCompletion = async () => {
  if (!user || !course) return;
  setClaimingReward(true);

  // Verificar si ya existe certificado en Supabase
  const { data: existing } = await supabase
    .from('certificates')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existing) {
    setClaimingReward(false);
    setShowCelebration(true);
    return;
  }

  let txSignature: string | null = null;
  let steamMinted = false;

  if (publicKey && signTransaction && connected) {
    try {
      // 🔥 PRIMERO: Registrar usuario si no existe
      const isRegistered = await registerUserIfNeeded();
      
      if (!isRegistered) {
        console.error("No se pudo registrar el usuario");
        // Continuamos igual, pero el certificado se guarda en Supabase
      }

      // SEGUNDO: Completar curso
      const anchorWallet = {
        publicKey,
        signTransaction,
        signAllTransactions: async (txs: any[]) => {
          const signed = [];
          for (const tx of txs) {
            signed.push(await signTransaction(tx));
          }
          return signed;
        }
      };

      const provider = new AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
      const program = new Program(idl as any, PROGRAM_ID, provider);

      const [studentPda] = await PublicKey.findProgramAddress(
        [Buffer.from("student"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Obtener el contador actual de certificados
      let certificateCount = 0;
      try {
        const studentAccount = await program.account.studentAccount.fetch(studentPda);
        certificateCount = (studentAccount as any).certificatesCount || 0;
      } catch (e) {
        console.log("Estudiante no encontrado, usando contador 0");
      }

      const [certificatePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("certificate"),
          publicKey.toBuffer(),
          new BN(certificateCount).toArrayLike(Buffer, 'le', 8),
        ],
        PROGRAM_ID
      );

      console.log("🚀 Enviando a Solana...");
      console.log("Student PDA:", studentPda.toString());
      console.log("Certificate PDA:", certificatePda.toString());

      txSignature = await program.methods
        .completeCourse(
          course.id,
          locale === 'es' ? course.title.es : course.title.en,
          new BN(course.steamReward)
        )
        .accounts({
          user: publicKey,
          studentAccount: studentPda,
          certificate: certificatePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      steamMinted = true;
      console.log("✅ EXITO! TX:", txSignature);

    } catch (error) {
      console.error("❌ Error:", error);
    }
  }

  // El resto del código igual...
  await supabase.from('certificates').insert({
    user_id: user.id,
    course_id: course.id,
    course_title_es: course.title.es,
    course_title_en: course.title.en,
    course_color: course.color,
    course_image: course.image,
    steam_reward: course.steamReward,
    mint_tx: txSignature,
  });

  // Actualizar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('courses_completed, certificates, steam_balance')
    .eq('id', user.id)
    .single();

  if (profile) {
    await supabase.from('profiles').update({
      courses_completed: (profile.courses_completed || 0) + 1,
      certificates: (profile.certificates || 0) + 1,
      steam_balance: (profile.steam_balance || 0) + course.steamReward,
    }).eq('id', user.id);
  }

  const prevBalance = parseInt(localStorage.getItem('steam_local_balance') ?? '0');
  localStorage.setItem('steam_local_balance', String(prevBalance + course.steamReward));
  window.dispatchEvent(new Event('steam-balance-update'));

  setRewardResult({ steamMinted, txSignature: txSignature || undefined });
  setClaimingReward(false);
  setShowCelebration(true);

  addNotification({
    type: 'reward',
    title: locale === 'es' ? 'Curso completado' : 'Course completed',
    description: `${title} · +${course.steamReward} STEAM`,
    href: `/courses/${course.id}`,
  });
};

  const completeModule = (moduleId: string) => {
    if (!progress || progress.completedModules.includes(moduleId)) return;
    const completedModules = [...progress.completedModules, moduleId];
    const allModulesDone = completedModules.length >= totalModules;
    const hasGame = !!course.game;
    const isNowComplete = allModulesDone && (!hasGame || progress.gameCompleted);

    const next = { ...progress, completedModules, completedAt: isNowComplete && !progress.completedAt ? new Date().toISOString() : progress.completedAt };
    setProgress(next);
    saveProgressForCourse(next);
    setEnrolled(true);
    
    if (isNowComplete && !progress.completedAt) {
      handleCompletion();
    }
  };

  const completeGame = () => {
    if (!progress || !course.game) return;
    if (gameAnswer.trim().toLowerCase() !== course.game.answer.trim().toLowerCase()) {
      setGameMessage(locale === 'es' ? 'Intenta otra vez.' : 'Try again.');
      return;
    }
    const allModulesDone = progress.completedModules.length >= totalModules;
    const isNowComplete = allModulesDone;
    const next = { ...progress, gameCompleted: true, completedAt: isNowComplete && !progress.completedAt ? new Date().toISOString() : progress.completedAt };
    setProgress(next);
    saveProgressForCourse(next);
    setGameMessage(locale === 'es' ? '¡Reto completado!' : 'Challenge completed!');
    setEnrolled(true);
    if (isNowComplete && !progress.completedAt) handleCompletion();
  };

  const removeCourse = async () => {
    if (!confirm(locale === 'es' ? `Eliminar "${title}"?` : `Delete "${title}"?`)) return;
    await deleteSharedCourse(course);
    addNotification({ type: 'course', title: locale === 'es' ? 'Curso eliminado' : 'Course deleted', description: title, href: '/courses' });
    navigate('/courses');
  };

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className={`flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color}`}>
            {course.bannerUrl ? <img src={course.bannerUrl} alt={title} className="h-full w-full rounded-2xl object-cover" /> : <span className="text-7xl font-black text-white">{course.image}</span>}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /> {diffLabel}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.enrolled} {t.courses.students}</span>
            <span className="flex items-center gap-1.5 text-steam"><Coins className="h-4 w-4" /> +{course.steamReward} STEAM</span>
          </div>

          {enrolled && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{t.courses.progress}</span>
                <span className="text-xs font-semibold text-foreground">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {!enrolled && <button onClick={() => setEnrolled(true)} className="rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-bold text-accent-foreground">{t.courses.enroll}</button>}
            {canEdit && <Link to={`/courses/${course.id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700"><Pencil className="h-4 w-4" />Editar</Link>}
            {canEdit && <button onClick={removeCourse} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"><Trash2 className="h-4 w-4" />Eliminar</button>}
          </div>
        </div>

        <Card className="border-border bg-card shadow-theme-sm h-fit sticky top-24">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-foreground">{t.courses.lessons} ({completedCount}/{totalModules})</CardTitle></CardHeader>
          <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
            {modules.map((lesson) => {
              const isCompleted = !!progress?.completedModules.includes(lesson.id);
              const isCurrent = currentModule.id === lesson.id && !isCompleted;
              const Icon = lesson.type === 'video' ? FileVideo : lesson.type === 'presentation' ? Presentation : lesson.type === 'game' ? Gamepad2 : Circle;
              return (
                <div key={lesson.id} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${isCurrent ? 'bg-secondary/10 border border-secondary/20 text-foreground font-semibold' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : isCurrent ? <PlayCircle className="h-4 w-4 text-secondary shrink-0" /> : <Icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{locale === 'es' ? lesson.title.es : lesson.title.en}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {enrolled && (
        <Card className="border-border bg-card shadow-theme-sm">
          <CardContent className="p-8">
            <div className="mb-4 flex items-center gap-3"><PlayCircle className="h-5 w-5 text-secondary" /><h2 className="text-lg font-bold text-foreground">{locale === 'es' ? currentModule.title.es : currentModule.title.en}</h2></div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => completeModule(currentModule.id)} className="rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                {progress?.completedModules.includes(currentModule.id) ? t.common.completed : locale === 'es' ? 'Completar bloque' : 'Complete block'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {enrolled && course.game && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-lg font-bold text-amber-950">{locale === 'es' ? course.game.title.es : course.game.title.en}</h2><p className="mt-2 text-sm text-amber-900">{locale === 'es' ? course.game.prompt.es : course.game.prompt.en}</p></div>
              {progress?.gameCompleted && <CheckCircle2 className="h-6 w-6 text-success" />}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input value={gameAnswer} onChange={(e) => setGameAnswer(e.target.value)} disabled={progress?.gameCompleted} className="min-w-64 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm" placeholder={locale === 'es' ? 'Tu respuesta' : 'Your answer'} />
              <button onClick={completeGame} disabled={progress?.gameCompleted} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white">{progress?.gameCompleted ? t.common.completed : locale === 'es' ? 'Resolver reto' : 'Solve challenge'}</button>
              {gameMessage && <span className="text-xs font-semibold text-amber-800">{gameMessage}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {(claimingReward || showCelebration) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center">
            {claimingReward ? (
              <><Loader2 className="mx-auto h-12 w-12 animate-spin text-violet-500 mb-4" /><h2 className="text-lg font-bold">{locale === 'es' ? 'Acuñando tu certificado...' : 'Minting your certificate...'}</h2></>
            ) : (
              <>
                <button onClick={() => setShowCelebration(false)} className="absolute top-4 right-4 text-gray-400"><X className="h-4 w-4" /></button>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 mx-auto mb-4"><Trophy className="h-10 w-10 text-white" /></div>
                <h2 className="text-2xl font-extrabold text-gray-900">{locale === 'es' ? '¡Curso Completado!' : 'Course Completed!'}</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-amber-50 p-4"><Coins className="h-6 w-6 text-amber-500 mx-auto mb-1" /><p className="text-xl font-extrabold text-amber-600">+{course.steamReward}</p><p className="text-xs text-amber-700">STEAM</p></div>
                  <div className="rounded-2xl bg-pink-50 p-4"><div className="text-3xl mx-auto mb-1 text-center">{course.image}</div><p className="text-xs font-bold text-pink-700">{locale === 'es' ? 'NFT Certificado' : 'NFT Certificate'}</p></div>
                </div>
                {rewardResult?.txSignature && <p className="mt-3 text-[10px] text-gray-400 break-all">TX: {rewardResult.txSignature.slice(0, 20)}...</p>}
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setShowCelebration(false)} className="flex-1 rounded-xl border py-2.5 text-sm font-semibold">Continuar</button>
                  <Link to="/nfts" onClick={() => setShowCelebration(false)} className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-2.5 text-sm font-bold text-white">Ver mi NFT</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}