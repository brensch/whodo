package storysyncer

import "net/url"

type Story struct {
	SheetID    string
	ID         string
	Name       string
	Conclusion string
	Rounds     []Round
	Clues      []Clue
	Characters []Character
	Blurb      string
	Answers    []Answer
	Info       []Info
}

type Metadata struct {
	Name       string
	Blurb      string
	Conclusion string
}

type Round struct {
	Intro string
	Name  string
}

type Clue struct {
	CharacterName string
	Description   string
	Name          string
	Round         string
	URL           *url.URL
}

type Character struct {
	Blurb string
	// Info        []RoundInfo
	Name        string
	Costume     string
	Accessories string
}

type Info struct {
	Round     string
	Character string
	Public    bool
	Content   string
}

type Answer struct {
	Character string
	Details   string
}
