package storysyncer

import (
	"context"
	"fmt"
	"log"
	"net/url"
)

func (s *Server) SyncStory(story Story) {

	rounds, err := s.readRounds(story.SheetID)
	if err != nil {
		log.Println("error reading rounds", err.Error())
		return
	}

	characters, err := s.readCharacters(story.SheetID)
	if err != nil {
		log.Println("error reading characters", err.Error())
		return
	}

	info, err := s.readInfo(story.SheetID)
	if err != nil {
		log.Println("error reading info", err.Error())
		return
	}

	answers, err := s.readAnswers(story.SheetID)
	if err != nil {
		log.Println("error reading answers", err.Error())
		return
	}

	clues, err := s.readClues(story.SheetID)
	if err != nil {
		log.Println("error reading clues", err.Error())
		return
	}

	meta, err := s.readMetadata(story.SheetID)
	if err != nil {
		log.Println("error reading meta", err.Error())
		return
	}

	storyUpdate := &Story{
		ID:         story.ID,
		SheetID:    story.SheetID,
		Name:       meta.Name,
		Blurb:      meta.Blurb,
		Conclusion: meta.Conclusion,
		Clues:      clues,
		Characters: characters,
		Answers:    answers,
		Info:       info,
	}

	_, err = s.firestoreClient.
		Collection(StoriesCollection).
		Doc(story.ID).
		Set(context.Background(), storyUpdate)
	if err != nil {
		log.Println("got error trying to sync new story state", err.Error())
	}

	fmt.Println(storyUpdate)

	log.Println(rounds)
	log.Println(characters)
	log.Println(info)
	log.Println(answers)
	log.Println(clues)
	return
}

func (s *Server) SyncAllStories() {
	s.sheetsLock.Lock()
	defer s.sheetsLock.Unlock()
	for _, story := range s.stories {
		s.SyncStory(story)
	}
}

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
			return fmt.Errorf("round %s not found in info number %d", info.Round, infoNumber)
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
			return fmt.Errorf("character %s not found in info number %d", info.Character, infoNumber)
		}
	}

	return
}

func (s *Server) readRounds(sheetID string) (rounds []Round, err error) {

	readRange := "rounds!A2:B"

	values, err := s.sheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 2 {
			return nil, fmt.Errorf("incorrect number of columns in 'rounds', row %d", row+1)
		}

		name, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("name is not a string in 'rounds', row %d", row+1)
		}

		intro, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("intro is not a string in 'rounds', row %d", row+1)
		}

		rounds = append(rounds, Round{Name: name, Intro: intro})
	}

	return
}

func (s *Server) readMetadata(sheetID string) (meta *Metadata, err error) {

	readRange := "metadata!B:B"

	values, err := s.sheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	if len(values.Values) != 3 {
		return nil, fmt.Errorf("incorrect number of metadata rows, expecting 2, got %d", len(values.Values))

	}

	name, ok := values.Values[0][0].(string)
	if !ok {
		return nil, fmt.Errorf("name is not a string in 'metadata'")
	}

	blurb, ok := values.Values[1][0].(string)
	if !ok {
		return nil, fmt.Errorf("blurb is not a string in 'metadata'")
	}

	conclusion, ok := values.Values[2][0].(string)
	if !ok {
		return nil, fmt.Errorf("conclusion is not a string in 'metadata'")
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

	values, err := s.sheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 4 {
			return nil, fmt.Errorf("incorrect number of columns in 'characters', row %d", row+1)
		}

		name, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("name is not a string in 'characters', row %d", row+1)
		}

		blurb, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("blurb is not a string in 'characters', row %d", row+1)
		}

		costume, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("costume is not a string in 'characters', row %d", row+1)
		}

		accessories, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("accessories is not a string in 'characters', row %d", row+1)
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

	values, err := s.sheetsClient.Spreadsheets.Values.
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
			return nil, fmt.Errorf("incorrect number of columns in 'info', row %d. %+v", row+1, columns)
		}

		round, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("round is not a string in 'info', row %d", row+1)
		}

		character, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("character is not a string in 'info', row %d", row+1)
		}

		public, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("public is not a string in 'info', row %d", row+1)
		}
		if public != "TRUE" && public != "FALSE" {
			return nil, fmt.Errorf("public is not either TRUE or FALSE, row %d", row+1)
		}
		publicBool := public == "TRUE"

		content, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("content is not a string in 'info', row %d", row+1)
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

	values, err := s.sheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 5 {
			return nil, fmt.Errorf("incorrect number of columns in 'clues', row %d", row+1)
		}

		character, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("character is not a string in 'clues', row %d", row+1)
		}

		round, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("round is not a string in 'clues', row %d", row+1)
		}

		urlString, ok := columns[2].(string)
		if !ok {
			return nil, fmt.Errorf("url is not a string in 'clues', row %d", row+1)
		}
		urlParsed, err := url.Parse(urlString)
		if !ok {
			return nil, fmt.Errorf("url is not a valid url in 'clues', row %d: %s", row+1, err.Error())
		}

		name, ok := columns[3].(string)
		if !ok {
			return nil, fmt.Errorf("name is not a string in 'clues', row %d", row+1)
		}

		description, ok := columns[4].(string)
		if !ok {
			return nil, fmt.Errorf("description is not a string in 'clues', row %d", row+1)
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

	values, err := s.sheetsClient.Spreadsheets.Values.
		Get(sheetID, readRange).
		Context(context.Background()).
		Do()
	if err != nil {
		return
	}

	for row, columns := range values.Values {
		if len(columns) != 2 {
			return nil, fmt.Errorf("incorrect number of columns in 'answers', row %d", row+1)
		}

		character, ok := columns[0].(string)
		if !ok {
			return nil, fmt.Errorf("character is not a string in 'answers', row %d", row+1)
		}

		details, ok := columns[1].(string)
		if !ok {
			return nil, fmt.Errorf("details is not a string in 'answers', row %d", row+1)
		}

		answers = append(answers, Answer{Character: character, Details: details})
	}

	return
}
