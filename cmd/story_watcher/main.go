package main

import (
	"context"
	"time"

	"github.com/brensch/whodo/pkg/storysyncer"
)

func main() {
	ctx := context.Background()

	s := storysyncer.InitServer(ctx)

	for {
		s.SyncAllStories()
		time.Sleep(10 * time.Second)
	}

	// // The ID of the spreadsheet to retrieve data from.
	// spreadsheetId := "1LOpzSZx8lZc3naSriDQ217IWh32_O5FHIfEiMaoT2c0" // TODO: Update placeholder value.
	// readRange := "rounds!A:C"
	// writeRange := "sync_status!B1"
	// // How dates, times, and durations should be represented in the output.
	// // This is ignored if value_render_option is
	// // FORMATTED_VALUE.
	// // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].

	// resp, err := sheetsService.Spreadsheets.Values.Get(spreadsheetId, readRange).Context(ctx).Do()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Printf("%#v\n", resp)

	// var vr sheets.ValueRange
	// myval := []interface{}{"smello berld"}
	// vr.Values = append(vr.Values, myval)

	// updateResponse, err := sheetsService.Spreadsheets.Values.
	// 	Update(spreadsheetId, writeRange, &vr).
	// 	ValueInputOption("RAW").
	// 	Do()
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// res, _ := updateResponse.MarshalJSON()
	// fmt.Println(string(res))
	// TODO: Change code below to process the `resp` object:
}
