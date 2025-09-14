using Microsoft.EntityFrameworkCore;
using UPESSC.Models;

namespace UPESSC.Data
{
    public class UPESSCDbContext : DbContext
    {

        public UPESSCDbContext(DbContextOptions<UPESSCDbContext> options) : base(options)
        {
        }

        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Institute> Institutes { get; set; }
        public DbSet<CandidateEducationalQualification> CandidateEducationalQualifications { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ExaminationMasters> ExaminationMasters { get; set; }
        public DbSet<CandidateInstitutePreference> CandidateInstitutePreferences { get; set; }
        public DbSet<Boards> Boards { get; set; }
        public DbSet<ExpertsMaster> ExpertsMasters { get; set; }
        public DbSet<BoardCM> BoardCMs { get; set; }
        public DbSet<SubjectSchedule> SubjectSchedules { get; set; }

    }
}
