import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <GraduationCap className="h-16 w-16 text-muted-foreground/20 mb-4" />
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-sm text-muted-foreground">Page not found / P��gina no encontrada</p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
    </div>
  );
}
