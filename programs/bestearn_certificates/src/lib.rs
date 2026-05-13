use anchor_lang::prelude::*;

declare_id!("Agm9NHABSZkPx2kZWwKxxnLDf1RNrFnAfBSerkvsfdnY");

const MAX_NAME_LEN: usize = 64;
const MAX_COURSE_ID_LEN: usize = 64;
const MAX_COURSE_TITLE_LEN: usize = 128;

#[program]
pub mod bestearn_certificates {
    use super::*;

    pub fn register_user(ctx: Context<RegisterUser>, name: String) -> Result<()> {
        require!(name.len() <= MAX_NAME_LEN, BestearnError::NameTooLong);

        let student = &mut ctx.accounts.student_account;
        student.owner = ctx.accounts.user.key();
        student.name = name;
        student.certificates_count = 0;
        student.total_steam = 0;

        Ok(())
    }

    pub fn complete_course(
        ctx: Context<CompleteCourse>,
        course_id: String,
        course_title: String,
        steam_amount: u64,
    ) -> Result<()> {
        require!(course_id.len() <= MAX_COURSE_ID_LEN, BestearnError::CourseIdTooLong);
        require!(
            course_title.len() <= MAX_COURSE_TITLE_LEN,
            BestearnError::CourseTitleTooLong
        );

        let student = &mut ctx.accounts.student_account;
        require_keys_eq!(student.owner, ctx.accounts.user.key(), BestearnError::InvalidOwner);

        let certificate = &mut ctx.accounts.certificate;
        certificate.owner = ctx.accounts.user.key();
        certificate.certificate_number = student.certificates_count + 1;
        certificate.course_id = course_id;
        certificate.course_title = course_title;
        certificate.completed_at = Clock::get()?.unix_timestamp;
        certificate.steam_reward = steam_amount;

        student.certificates_count = student
            .certificates_count
            .checked_add(1)
            .ok_or(BestearnError::MathOverflow)?;
        student.total_steam = student
            .total_steam
            .checked_add(steam_amount)
            .ok_or(BestearnError::MathOverflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = StudentAccount::SPACE,
        seeds = [b"student", user.key().as_ref()],
        bump
    )]
    pub student_account: Account<'info, StudentAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteCourse<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"student", user.key().as_ref()],
        bump,
        has_one = owner @ BestearnError::InvalidOwner
    )]
    pub student_account: Account<'info, StudentAccount>,
    #[account(
        init,
        payer = user,
        space = CertificateAccount::SPACE,
        seeds = [
            b"certificate",
            user.key().as_ref(),
            &student_account.certificates_count.to_le_bytes()
        ],
        bump
    )]
    pub certificate: Account<'info, CertificateAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct StudentAccount {
    pub owner: Pubkey,
    pub name: String,
    pub certificates_count: u64,
    pub total_steam: u64,
}

impl StudentAccount {
    pub const SPACE: usize = 8 + 32 + 4 + MAX_NAME_LEN + 8 + 8;
}

#[account]
pub struct CertificateAccount {
    pub owner: Pubkey,
    pub certificate_number: u64,
    pub course_id: String,
    pub course_title: String,
    pub completed_at: i64,
    pub steam_reward: u64,
}

impl CertificateAccount {
    pub const SPACE: usize = 8 + 32 + 8 + 4 + MAX_COURSE_ID_LEN + 4 + MAX_COURSE_TITLE_LEN + 8 + 8;
}

#[error_code]
pub enum BestearnError {
    #[msg("The student name is too long.")]
    NameTooLong,
    #[msg("The course ID is too long.")]
    CourseIdTooLong,
    #[msg("The course title is too long.")]
    CourseTitleTooLong,
    #[msg("Only the student account owner can complete courses.")]
    InvalidOwner,
    #[msg("Math overflow.")]
    MathOverflow,
}
