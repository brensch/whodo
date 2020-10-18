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
}

type Round struct {
	Intro string
	Name  string
}

type Clue struct {
	CharacterName string
	Description   string
	ClueName      string
	RoundNumber   int
	URL           url.URL
}

type Character struct {
	Blurb       string
	Info        []RoundInfo
	Name        string
	Costume     string
	Accessories string
}

type RoundInfo struct {
	Public  []Info
	Private []Info
}

type InfoFromSheet struct {
	round     string
	character string
	public    bool
	content   string
}

type Answer struct {
	Character string
	Details   string
}

type Info string
