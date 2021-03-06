import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import {
  Character,
  StoryMetadata,
  Round,
  TimelineEvent,
  Info,
  Clue,
  Answer,
  Story,
  StorySummary,
} from "../Schema/Story";

let sheets: sheets_v4.Sheets;

const initSheets = async () => {
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
  const auth = new GoogleAuth({
    scopes: SCOPES,
  });
  const authClient = (await auth.getClient()) as unknown;

  return google.sheets({
    version: "v4",
    auth: authClient as string,
  });
};

export const ReadStoryFromSheet = async (
  SheetID: string,
): Promise<Story | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const Rounds = await readRounds(SheetID);
  const TimelineEvents = await readTimelineEvents(SheetID);
  const StoryMetadata = await readStoryMetadata(SheetID);
  const Info = await readInfo(SheetID);
  const Characters = await readCharacters(SheetID);
  const Clues = await readClues(SheetID);
  const Answers = await readAnswers(SheetID);

  if (Rounds instanceof Error) {
    return Rounds;
  }
  if (TimelineEvents instanceof Error) {
    return TimelineEvents;
  }
  if (StoryMetadata instanceof Error) {
    return StoryMetadata;
  }
  if (Info instanceof Error) {
    return Info;
  }
  if (Characters instanceof Error) {
    return Characters;
  }
  if (Clues instanceof Error) {
    return Clues;
  }
  if (Answers instanceof Error) {
    return Answers;
  }

  return {
    ID: null,
    Metadata: StoryMetadata,
    Answers: Answers,
    Rounds: Rounds,
    Info: Info,
    SheetID: SheetID,
    TimelineEvents: TimelineEvents,
    Clues: Clues,
    Characters: Characters,
    SyncError: null,
  };
};

export const SummariseStory = (story: Story, storyID: string): StorySummary => {
  const metadataNoConclusion: StoryMetadata = {
    Name: story.Metadata.Name,
    Blurb: story.Metadata.Blurb,
    Conclusion: null,
  };
  return {
    ID: storyID,
    Characters: story.Characters,
    Rounds: story.Rounds,
    Metadata: metadataNoConclusion,
  };
};

export const readRounds = async (sheetID: string): Promise<Round[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "rounds!A2:B",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    return rows.map((row) => ({
      Name: row[0],
      Intro: row[1],
    }));
  }

  return Error("no rounds found");
};

export const readClues = async (sheetID: string): Promise<Clue[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "clues!A2:E",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    return rows.map((row) => ({
      CharacterName: row[0],
      Round: row[1],
      URL: row[2],
      Name: row[3],
      Description: row[4],
    }));
  }

  return [];
};

export const readAnswers = async (
  sheetID: string,
): Promise<Answer[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "answers!A2:B",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    return rows.map((row, i) => ({
      Number: i,
      Character: row[0],
      Details: row[1],
    }));
  }

  return Error("no answers found");
};

export const readCharacters = async (
  sheetID: string,
): Promise<Character[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "characters!A2:F",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    return rows.map((row) => ({
      Name: row[0],
      Description: row[1],
      Blurb: row[2],
      Age: row[3],
      Costume: row[4],
      Accessories: row[5],
    }));
  }

  return Error("no characters found");
};

export const readInfo = async (sheetID: string): Promise<Info[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "info!A2:D",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    return rows
      .filter((row) => !(row[0] === "" && row[1] === "" && row[2] === "FALSE"))
      .map((row) => ({
        Round: row[0],
        Character: row[1],
        Public: row[2] === "TRUE",
        Content: row[3],
      }));
  }

  return Error("no info found");
};

export const readStoryMetadata = async (
  sheetID: string,
): Promise<StoryMetadata | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "metadata!B:B",
  });

  const rows = r.data.values;
  console.log("rows", rows);
  if (rows && rows.length) {
    return {
      Name: rows[0][0],
      Blurb: rows[1][0],
      Conclusion: rows[2][0],
    };
  }

  return Error("no story found");
};

export const readTimelineEvents = async (
  sheetID: string,
): Promise<TimelineEvent[] | Error> => {
  if (!sheets) {
    sheets = await initSheets();
  }

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: "timeline!A:Z",
  });

  const rows = r.data.values;
  if (rows && rows.length) {
    const characters = rows[0].slice(1);
    const timelines: Array<TimelineEvent> = [];
    rows
      .slice(1)
      .filter((row) => !!row.length)
      .forEach((row) => {
        row.slice(1).forEach((cell, column) => {
          if (cell !== "") {
            timelines.push({
              Time: row[0],
              Event: cell,
              Character: characters[column],
            });
          }
        });
      });
    return timelines;
  }

  return Error("no timeline found");
};
