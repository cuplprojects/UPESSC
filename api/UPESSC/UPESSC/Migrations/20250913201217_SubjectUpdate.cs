using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UPESSC.Migrations
{
    /// <inheritdoc />
    public partial class SubjectUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubjectNameEnglish",
                table: "Subjects",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubjectNameEnglish",
                table: "Subjects");
        }
    }
}
