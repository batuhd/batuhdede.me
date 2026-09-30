import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import fontsData from "./fonts.json";
import type { CvData, CvEntry } from "./index";

const CV_FONTS: Record<string, string> = fontsData;

Font.register({
  family: "Inter",
  fonts: [
    { src: CV_FONTS.regular, fontWeight: 400 },
    { src: CV_FONTS.semibold, fontWeight: 600 },
    { src: CV_FONTS.bold, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#1f1a17",
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 46,
  },
  header: {
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  role: {
    fontSize: 10.5,
    fontWeight: 600,
    color: "#7a4b35",
    textAlign: "center",
  },
  contact: {
    fontSize: 8.5,
    color: "#6b6156",
    textAlign: "center",
  },
  section: {
    marginTop: 18,
  },
  sectionTitleWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "#bf8b67",
    paddingBottom: 4,
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  entry: {
    marginBottom: 11,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: 600,
    flex: 1,
    paddingRight: 10,
  },
  entryDates: {
    fontSize: 8.5,
    color: "#6b6156",
    flexShrink: 0,
    textAlign: "right",
  },
  entrySubtitle: {
    fontSize: 9,
    fontWeight: 600,
    color: "#6b6156",
    marginTop: 2,
  },
  entryLocation: {
    fontSize: 8.5,
    color: "#8a7d70",
    marginTop: 1,
  },
  bullets: {
    marginTop: 5,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletMark: {
    width: 9,
  },
  bulletText: {
    flex: 1,
  },
  skillLine: {
    flexDirection: "row",
    marginBottom: 6,
  },
  skillTitle: {
    fontWeight: 600,
    width: 150,
    paddingRight: 8,
  },
  skillItems: {
    flex: 1,
  },
  langLine: {
    flexDirection: "row",
    marginBottom: 4,
  },
  langName: {
    fontWeight: 600,
    width: 150,
  },
  langLevel: {
    flex: 1,
  },
  references: {
    fontSize: 9,
    color: "#6b6156",
  },
});

function Entry({ entry }: { entry: CvEntry }) {
  return (
    <View style={styles.entry}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{entry.title}</Text>
        {(entry.startDate || entry.endDate) && (
          <Text style={styles.entryDates}>
            {entry.startDate}
            {entry.endDate ? ` - ${entry.endDate}` : ""}
          </Text>
        )}
      </View>
      {entry.subtitle && (
        <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>
      )}
      {entry.location && (
        <Text style={styles.entryLocation}>{entry.location}</Text>
      )}
      {entry.bullets.length > 0 && (
        <View style={styles.bullets}>
          {entry.bullets.map((b, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletMark}>{"•"}</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function CvDocument({
  data,
  labels,
}: {
  data: CvData;
  labels: {
    education: string;
    experience: string;
    leadership: string;
    skills: string;
    languages: string;
    references: string;
  };
}) {
  return (
    <Document
      title={`${data.name} - CV`}
      author={data.name}
      creator={data.name}
      subject="Curriculum Vitae"
    >
      <Page size="A4" style={styles.page} minPresenceAhead={80}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
        </View>
        {data.role && (
          <View style={{ marginTop: 5 }}>
            <Text style={styles.role}>{data.role}</Text>
          </View>
        )}
        {data.contactLine.length > 0 && (
          <View style={{ marginTop: 9 }}>
            <Text style={styles.contact}>
              {data.contactLine.join("  |  ")}
            </Text>
          </View>
        )}

        {data.education.length > 0 && (
          <Section title={labels.education}>
            {data.education.map((e, i) => (
              <Entry key={i} entry={e} />
            ))}
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title={labels.experience}>
            {data.experience.map((e, i) => (
              <Entry key={i} entry={e} />
            ))}
          </Section>
        )}

        {data.leadership.length > 0 && (
          <Section title={labels.leadership}>
            {data.leadership.map((e, i) => (
              <Entry key={i} entry={e} />
            ))}
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title={labels.skills}>
            {data.skills.map((g, i) => (
              <View key={i} style={styles.skillLine}>
                <Text style={styles.skillTitle}>{g.title}:</Text>
                <Text style={styles.skillItems}>{g.items.join(", ")}</Text>
              </View>
            ))}
          </Section>
        )}

        {data.languages.length > 0 && (
          <Section title={labels.languages}>
            {data.languages.map((l, i) => (
              <View key={i} style={styles.langLine}>
                <Text style={styles.langName}>{l.name}:</Text>
                <Text style={styles.langLevel}>{l.level}</Text>
              </View>
            ))}
          </Section>
        )}

        <Section title={labels.references}>
          <Text style={styles.references}>{data.referencesNote}</Text>
        </Section>
      </Page>
    </Document>
  );
}