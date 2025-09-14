using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UPESSC.Migrations
{
    /// <inheritdoc />
    public partial class CandidateUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CandidateName",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "RegistrationNumber",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "RollNumber",
                table: "Candidates");

            migrationBuilder.RenameColumn(
                name: "SubjectCode",
                table: "Candidates",
                newName: "is_SLET_SET");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "Candidates",
                newName: "is_Phd");

            migrationBuilder.RenameColumn(
                name: "SubCategory",
                table: "Candidates",
                newName: "is_NET");

            migrationBuilder.RenameColumn(
                name: "ProfileImage",
                table: "Candidates",
                newName: "is_JRF");

            migrationBuilder.RenameColumn(
                name: "MobileNumber",
                table: "Candidates",
                newName: "UP_Resident");

            migrationBuilder.RenameColumn(
                name: "MaritalStatus",
                table: "Candidates",
                newName: "Subject_Name");

            migrationBuilder.RenameColumn(
                name: "InterviewDate",
                table: "Candidates",
                newName: "Sub_Subject");

            migrationBuilder.RenameColumn(
                name: "InterviewBoard",
                table: "Candidates",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "FatherOrHusbandName",
                table: "Candidates",
                newName: "Sign_File");

            migrationBuilder.RenameColumn(
                name: "DOB",
                table: "Candidates",
                newName: "SLET_Subject");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Candidates",
                newName: "Photo_File");

            migrationBuilder.AddColumn<string>(
                name: "Aadhaar_No",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Line1",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Line2",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Line3",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Line4",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address_Line5",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Category_Code",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Created_Date",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DFF",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Date_of_Birth",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "Enrollment_No",
                table: "Candidates",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "Father_Name",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Husband_Name",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "JRF_Subject",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Marital_Status",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MobileNo",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Mother_Name",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NET_Subject",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PG_Before_91",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PH",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Payment_Date",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Payment_ID",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Payment_Mode",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Payment_Status",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_Address_Line1",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_Address_Line2",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_Address_Line3",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_Address_Line4",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_Address_Line5",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Permanent_District",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Permanent_Postal_Code",
                table: "Candidates",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Permanent_State",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phd_Subject",
                table: "Candidates",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Postal_Code",
                table: "Candidates",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aadhaar_No",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Address_Line1",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Address_Line2",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Address_Line3",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Address_Line4",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Address_Line5",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Category_Code",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Created_Date",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "DFF",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Date_of_Birth",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Enrollment_No",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Father_Name",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Husband_Name",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "JRF_Subject",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Marital_Status",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "MobileNo",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Mother_Name",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "NET_Subject",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "PG_Before_91",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "PH",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Payment_Date",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Payment_ID",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Payment_Mode",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Payment_Status",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Address_Line1",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Address_Line2",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Address_Line3",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Address_Line4",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Address_Line5",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_District",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_Postal_Code",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Permanent_State",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Phd_Subject",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Postal_Code",
                table: "Candidates");

            migrationBuilder.RenameColumn(
                name: "is_SLET_SET",
                table: "Candidates",
                newName: "SubjectCode");

            migrationBuilder.RenameColumn(
                name: "is_Phd",
                table: "Candidates",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "is_NET",
                table: "Candidates",
                newName: "SubCategory");

            migrationBuilder.RenameColumn(
                name: "is_JRF",
                table: "Candidates",
                newName: "ProfileImage");

            migrationBuilder.RenameColumn(
                name: "UP_Resident",
                table: "Candidates",
                newName: "MobileNumber");

            migrationBuilder.RenameColumn(
                name: "Subject_Name",
                table: "Candidates",
                newName: "MaritalStatus");

            migrationBuilder.RenameColumn(
                name: "Sub_Subject",
                table: "Candidates",
                newName: "InterviewDate");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Candidates",
                newName: "InterviewBoard");

            migrationBuilder.RenameColumn(
                name: "Sign_File",
                table: "Candidates",
                newName: "FatherOrHusbandName");

            migrationBuilder.RenameColumn(
                name: "SLET_Subject",
                table: "Candidates",
                newName: "DOB");

            migrationBuilder.RenameColumn(
                name: "Photo_File",
                table: "Candidates",
                newName: "Category");

            migrationBuilder.AddColumn<string>(
                name: "CandidateName",
                table: "Candidates",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RegistrationNumber",
                table: "Candidates",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RollNumber",
                table: "Candidates",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
