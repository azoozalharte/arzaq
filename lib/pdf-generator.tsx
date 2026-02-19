"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

interface ResumeData {
  fullName: string;
  title: string;
  summary: string;
  experience: {
    company: string;
    position: string;
    duration: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
  contact: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

// Helper function to check if a value is valid (not empty or placeholder)
const isValidValue = (value: string | undefined): boolean => {
  if (!value) return false;
  const placeholders = [
    "not provided",
    "not available",
    "n/a",
    "unknown",
    "none",
    "graduation year not provided",
  ];
  return !placeholders.some((p) => value.toLowerCase().includes(p));
};

// ATS-friendly styles - simple, clean, with proper spacing
const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#000000",
  },
  // Header Section
  header: {
    marginBottom: 24,
    textAlign: "left",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 12,
    color: "#444444",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 10,
    color: "#444444",
  },
  contactItem: {
    marginRight: 8,
  },
  // Section Styles
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
  },
  // Summary
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#333333",
    textAlign: "left",
  },
  // Experience
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  experienceLeft: {
    flex: 1,
    paddingRight: 10,
  },
  positionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  companyName: {
    fontSize: 10,
    color: "#444444",
    marginBottom: 6,
  },
  duration: {
    fontSize: 10,
    color: "#444444",
    textAlign: "right",
    minWidth: 80,
  },
  achievementsList: {
    marginTop: 6,
  },
  achievementItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 14,
    fontSize: 10,
    color: "#000000",
  },
  achievementText: {
    flex: 1,
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
  },
  // Education
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  educationLeft: {
    flex: 1,
    paddingRight: 10,
  },
  degreeName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  institutionName: {
    fontSize: 10,
    color: "#444444",
  },
  yearText: {
    fontSize: 10,
    color: "#444444",
    textAlign: "right",
    minWidth: 60,
  },
  // Skills
  skillsText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
  },
});

const ResumeDocument = ({ data }: { data: ResumeData }) => {
  // Format contact info - filter out invalid values
  const contactParts = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
  ].filter((item) => isValidValue(item));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          <Text style={styles.title}>{data.title}</Text>
          {contactParts.length > 0 && (
            <View style={styles.contactRow}>
              {contactParts.map((item, index) => (
                <Text key={index} style={styles.contactItem}>
                  {item}
                  {index < contactParts.length - 1 ? "  |  " : ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {data.summary && isValidValue(data.summary) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View style={styles.experienceLeft}>
                    <Text style={styles.positionTitle}>{exp.position}</Text>
                    <Text style={styles.companyName}>{exp.company}</Text>
                  </View>
                  {isValidValue(exp.duration) && (
                    <Text style={styles.duration}>{exp.duration}</Text>
                  )}
                </View>
                {exp.achievements && exp.achievements.length > 0 && (
                  <View style={styles.achievementsList}>
                    {exp.achievements
                      .filter((a) => isValidValue(a))
                      .map((achievement, i) => (
                        <View key={i} style={styles.achievementItem}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.achievementText}>{achievement}</Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <View style={styles.educationLeft}>
                    <Text style={styles.degreeName}>{edu.degree}</Text>
                    <Text style={styles.institutionName}>{edu.institution}</Text>
                  </View>
                  {isValidValue(edu.year) && (
                    <Text style={styles.yearText}>{edu.year}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>
              {data.skills.filter((s) => isValidValue(s)).join("  •  ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export async function generatePDF(resumeData: ResumeData): Promise<Blob> {
  const blob = await pdf(<ResumeDocument data={resumeData} />).toBlob();
  return blob;
}

export function downloadPDF(blob: Blob, filename: string = "resume.pdf") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
