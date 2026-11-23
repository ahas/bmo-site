import archiveEn from "../assets/shots/archive-document-en.webp";
import archiveKo from "../assets/shots/archive-document-ko.webp";
import calendarPhoneEn from "../assets/shots/calendar-phone-en.webp";
import calendarEn from "../assets/shots/calendar-week-en.webp";
import calendarKo from "../assets/shots/calendar-week-ko.webp";
import roomPhoneKo from "../assets/shots/console-room-phone-ko.webp";
import roomKo from "../assets/shots/console-room-ko.webp";
import notePhoneEn from "../assets/shots/note-phone-en.webp";
import notePhoneKo from "../assets/shots/note-phone-ko.webp";
import noteEn from "../assets/shots/note-en.webp";

// The screenshots each capture language shows. Every picture on a page is captured in that page's capture
// language (`captureLocale`), and its file name ends in that language, which the browser test reads. The console's
// own room speaks Korean alone, so the English pages lead with the notes screen instead.

type Capture = "en" | "ko";

export const HERO_SHOTS: Record<Capture, { wide: ImageMetadata; phone: ImageMetadata }> = {
  en: { wide: noteEn, phone: notePhoneEn },
  ko: { wide: roomKo, phone: roomPhoneKo },
};

/** The gallery's pictures by the key of the caption each language writes for them. */
export const SCREEN_SHOTS: Record<Capture, { calendar: ImageMetadata; archive: ImageMetadata; phone: ImageMetadata }> = {
  en: { calendar: calendarEn, archive: archiveEn, phone: calendarPhoneEn },
  ko: { calendar: calendarKo, archive: archiveKo, phone: notePhoneKo },
};
