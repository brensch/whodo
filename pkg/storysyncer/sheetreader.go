package storysyncer

import (
	"context"
	"fmt"
	"log"
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

	infoFromSheet, err := s.readInfo(story.SheetID)
	if err != nil {
		log.Println("error reading info", err.Error())
		return
	}

	answers, err := s.readAnswers(story.SheetID)
	if err != nil {
		log.Println("error reading info", err.Error())
		return
	}

	log.Println(rounds)
	log.Println(characters)
	log.Println(infoFromSheet)
	log.Println(answers)
	return
}

func (s *Server) SyncAllStories() {
	s.sheetsLock.Lock()
	defer s.sheetsLock.Unlock()
	for _, story := range s.stories {
		s.SyncStory(story)
	}

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

func (s *Server) readInfo(sheetID string) (infos []InfoFromSheet, err error) {

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

		infos = append(infos, InfoFromSheet{
			round:     round,
			character: character,
			public:    publicBool,
			content:   content,
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
