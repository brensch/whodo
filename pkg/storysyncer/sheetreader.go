package storysyncer

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
)

func (s *Server) SyncStory(story Story) {

	rounds, err := s.readRounds(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading rounds", err.Error())
		return
	}

	characters, err := s.readCharacters(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading characters", err.Error())
		return
	}

	info, err := s.readInfo(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading info", err.Error())
		return
	}

	answers, err := s.readAnswers(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading answers", err.Error())
		return
	}

	clues, err := s.readClues(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading clues", err.Error())
		return
	}

	timelines, err := s.readTimeline(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading timelines", err.Error())
		return
	}

	meta, err := s.readMetadata(story.SheetID)
	if err != nil {
		fmt.Println(story.ID, "- error reading meta", err.Error())
		return
	}

	storyUpdate := &Story{
		ID:             story.ID,
		SheetID:        story.SheetID,
		Name:           meta.Name,
		Blurb:          meta.Blurb,
		Conclusion:     meta.Conclusion,
		Clues:          clues,
		Characters:     characters,
		Answers:        answers,
		Info:           info,
		Rounds:         rounds,
		TimelineEvents: timelines,
	}

	err = storyUpdate.validate()
	if err != nil {
		fmt.Println(story.ID, "- validation error on story", err.Error())
		return
	}

	existingJSON, err := json.Marshal(story)
	if err != nil {
		fmt.Println(story.ID, "- failed to marshal existing story", err.Error())
		return
	}

	newJSON, err := json.Marshal(storyUpdate)
	if err != nil {
		fmt.Println(story.ID, "- failed to marshal new story", err.Error())
		return
	}

	if string(existingJSON) == string(newJSON) {
		return
	}

	fmt.Println(story.ID, "- found differences, updating firestore")

	_, err = s.FirestoreClient.
		Collection(StoriesCollection).
		Doc(story.ID).
		Set(context.Background(), storyUpdate)
	if err != nil {
		fmt.Println(story.ID, "- got error trying to sync new story state", err.Error())
	}

	return
}

// func (s *Server) SyncAllStories() {
// 	s.sheetsLock.Lock()
// 	defer s.sheetsLock.Unlock()
// 	for _, story := range s.stories {
// 		s.SyncStory(story)
// 	}
// }

func (s *Story) validate() (err error) {
	for infoNumber, info := range s.Info {
		// check round is good
		foundRound := false
		for _, round := range s.Rounds {
			if round.Name == info.Round {
				foundRound = true
				break
			}
		}
		if !foundRound {
			return fmt.Errorf("%s - round %s not found in info number %d", s.ID, info.Round, infoNumber)
		}

		// check character is good
		foundCharacter := false
		for _, character := range s.Characters {
			if character.Name == info.Character {
				foundCharacter = true
				break
			}
		}
		if !foundCharacter {
			return fmt.Errorf("%s - character %s not found in info number %d", s.ID, info.Character, infoNumber)
		}
	}

	return
}

func (s *Server) readRounds(sheetID string) (rounds []Round, err error) {

	readRange := "rounds!A2:B"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 2 {
			return nil, fmt.Errorf("%s - incorrect number of columns in 'rounds', row %d", sheetID, row+1)
		}

		name, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("%s - name is not a string in 'rounds', row %d", sheetID, row+1)
		}

		intro, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("%s - intro is not a string in 'rounds', row %d", sheetID, row+1)
		}

		rounds = append(rounds, Round{Name: name, Intro: intro})
	}

	return
}

func (s *Server) readTimeline(sheetID string) (events []TimelineEvent, err error) {

	readRange := "timeline!A:Z"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	characterCount := len(values.Values[0]) - 1
	var characters []string
	for _, character := range values.Values[0][1:] {
		characterString, ok := character.(string)
		if !ok {
			return nil, fmt.Errorf("%s - character is not a string in header of timeline", sheetID)
		}
		characters = append(characters, characterString)
	}

	for row, columns := range values.Values[1:] {
		if len(columns) > characterCount+1 {
			return nil, fmt.Errorf("%s - more columns in timeline than characters, row %d", sheetID, row+1)
		}

		for column, event := range columns[1:] {
			eventString, ok := event.(string)
			if !ok {
				fmt.Printf("%s - event not string in row %d, column %d\n", sheetID, row+1, column+1)
				continue
			}

			if eventString != "" {
				time, ok := columns[0].(string)
				if !ok {
					return nil, fmt.Errorf("%s - time not string in row %d", sheetID, row+1)
				}
				events = append(events, TimelineEvent{
					Character: characters[column],
					Time:      time,
					Event:     eventString,
				})
			}
		}
	}

	return
}

func (s *Server) readMetadata(sheetID string) (meta *Metadata, err error) {

	readRange := "metadata!B:B"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	if len(values.Values) != 3 {
		return nil, fmt.Errorf("%s - incorrect number of metadata rows, expecting 3, got %d", sheetID, len(values.Values))
	}

	if len(values.Values[0]) != 1 || len(values.Values[1]) != 1 || len(values.Values[2]) != 1 {
		return nil, fmt.Errorf("%s - not all metadata fields filled out", sheetID)
	}

	name, ok := values.Values[0][0].(string)
	if !ok {
		return nil, fmt.Errorf("%s - name is not a string in 'metadata'", sheetID)
	}

	blurb, ok := values.Values[1][0].(string)
	if !ok {
		return nil, fmt.Errorf("%s - blurb is not a string in 'metadata'", sheetID)
	}

	conclusion, ok := values.Values[2][0].(string)
	if !ok {
		return nil, fmt.Errorf("%s - conclusion is not a string in 'metadata'", sheetID)
	}

	meta = &Metadata{
		Name:       name,
		Blurb:      blurb,
		Conclusion: conclusion,
	}

	return
}

func (s *Server) readCharacters(sheetID string) (characters []Character, err error) {

	readRange := "characters!A2:D"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 4 {
			return nil, fmt.Errorf("%s - incorrect number of columns in 'characters', row %d", sheetID, row+1)
		}

		name, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("%s - name is not a string in 'characters', row %d", sheetID, row+1)
		}

		blurb, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("%s - blurb is not a string in 'characters', row %d", sheetID, row+1)
		}

		costume, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("%s - costume is not a string in 'characters', row %d", sheetID, row+1)
		}

		accessories, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("%s - accessories is not a string in 'characters', row %d", sheetID, row+1)
		}

		characters = append(characters, Character{
			Name:        name,
			Blurb:       blurb,
			Costume:     costume,
			Accessories: accessories,
		})
	}

	return
}

func (s *Server) readInfo(sheetID string) (infos []Info, err error) {

	readRange := "info!A2:D"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {

		if len(columns) == 3 &&
			columns[0].(string) == "" &&
			columns[1].(string) == "" &&
			columns[2].(string) == "FALSE" {
			return
		}

		if len(columns) != 4 {
			return nil, fmt.Errorf("%s - incorrect number of columns in 'info', row %d. %+v", sheetID, row+1, columns)
		}

		round, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("%s - round is not a string in 'info', row %d", sheetID, row+1)
		}

		character, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("%s - character is not a string in 'info', row %d", sheetID, row+1)
		}

		public, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("%s - public is not a string in 'info', row %d", sheetID, row+1)
		}
		if public != "TRUE" && public != "FALSE" {
			return nil, fmt.Errorf("%s - public is not either TRUE or FALSE, row %d", sheetID, row+1)
		}
		publicBool := public == "TRUE"

		content, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("%s - content is not a string in 'info', row %d", sheetID, row+1)
		}

		infos = append(infos, Info{
			Round:     round,
			Character: character,
			Public:    publicBool,
			Content:   content,
		})
	}

	return
}

func (s *Server) readClues(sheetID string) (clues []Clue, err error) {

	readRange := "clues!A2:E"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 5 {
			return nil, fmt.Errorf("%s - incorrect number of columns in 'clues', row %d", sheetID, row+1)
		}

		character, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("%s - character is not a string in 'clues', row %d", sheetID, row+1)
		}

		round, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("%s - round is not a string in 'clues', row %d", sheetID, row+1)
		}

		urlString, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("%s - url is not a string in 'clues', row %d", sheetID, row+1)
		}
		urlParsed, err := url.Parse(urlString)
		if !ok {
			return nil, fmt.Errorf("%s - url is not a valid url in 'clues', row %d: %s", sheetID, row+1, err.Error())
		}

		name, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("%s - name is not a string in 'clues', row %d", sheetID, row+1)
		}

		description, ok := columns[4].(string)
		if !ok {
			return nil, fmt.Errorf("%s - description is not a string in 'clues', row %d", sheetID, row+1)
		}

		clues = append(clues, Clue{
			CharacterName: character,
			Round:         round,
			URL:           urlParsed,
			Name:          name,
			Description:   description,
		})
	}

	return
}

func (s *Server) readAnswers(sheetID string) (answers []Answer, err error) {

	readRange := "answers!A2:B"

	values, err := s.SheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 2 {
			return nil, fmt.Errorf("%s - incorrect number of columns in 'answers', row %d", sheetID, row+1)
		}

		character, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("%s - character is not a string in 'answers', row %d", sheetID, row+1)
		}

		details, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("%s - details is not a string in 'answers', row %d", sheetID, row+1)
		}

		answers = append(answers, Answer{Character: character, Details: details})
	}

	return
}
