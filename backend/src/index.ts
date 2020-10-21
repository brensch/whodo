import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { plainToClass } from "class-transformer";

admin.initializeApp();

const db = admin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// interface Test {
//   Yo: string;
// }

export interface Story {
  Conclusion: string;
  Name: string;
  Blurb: string;
  Answers: Answer[];
  Rounds: Round[];
  Info: Info[];
  ID: string;
  SheetID: string;
  TimelineEvents: TimelineEvent[];
  Clues: Clue[];
  Characters: Character[];
}

export interface Answer {
  Character: string;
  Details: string;
}

export interface Character {
  Accessories: string;
  Name: string;
  Blurb: string;
  Costume: string;
}

export interface Clue {
  URL: string;
  Round: string;
  Description: string;
  CharacterName: string;
  Name: string;
}

export interface Info {
  Public: boolean;
  Content: string;
  Round: string;
  Character: string;
}

export interface Round {
  Name: string;
  Intro: string;
}

export interface TimelineEvent {
  Time: string;
  Event: string;
  Character: string;
}

class Test {
  constructor(public Yo: string) {}

  send() {
    console.log("thing", this.Yo);
  }
}

export const watchStories = functions.firestore
  .document("stories2/{docID}")
  .onWrite((change, context) => {
    // const yeet = new Test({change.before.data()})

    const wo = JSON.parse(cool);
    console.log(wo);

    // console.log(test.Yo);
    // functions.logger.info("wo!", {
    //   structuredData: true,
    //   change: yeet,
    // });
  });

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  db.collection("stories2")
    .add({ yo: "lo" })
    .then(console.log)
    .catch(console.log);
  response.send("Hello from Firebase!");
});

const cool = `{
	"Conclusion": "Cool as a bool stooly",
	"Name": "wedding",
	"Blurb": "Angela and Andrew are getting married at a remote winery, and you're invited.",
	"Answers": [{
		"Character": "Deborah Allen",
		"Details": "I didn't like Angela, and that's no secret. She was pulling Andrew away from me, taking up more of his time so I'd see less and less of my son. I'm sure she's just after his money - I know what gold diggers look like, because I was one once.\nI might have spiked her drink, but I wasn't try to kill her. I just wanted to ruin her day. It turns out she didn't drink it anyway. \nSure, I know my late husband's death might seem suspicious to some, but that has nothing to do with this and it doesn't mean I'd kill Angela. I didn't even know my brother had brough one of his weird swords to the wedding - I couldn't have killed her."
	}, {
		"Character": "Andrew Allen",
		"Details": "I was devastated to learn that Angela was cheating on me - with my best man, no less! I spent so long supporting James through his addiction issues, making sure he didn't lose his job, paying for rehab - and this is how he repays me? \nAlthough this isn't just James's fault. I can't believe Angela would do this to me. Why even go through with the wedding if she didn't want to be with me? Maybe my mother was right about her.\nI'm furious, but I didn't kill her. I looked for her after I heard the news from Miranda last night, but she was nowhere to be found. I haven't even seen her since I heard.\nBesides, I never even opened the presents or knew about the sword. I couldn't have done it."
	}, {
		"Details": "I admit I'm not perfect, but I'm not a monster (despite what my ex-wife might say). \nFirst the company you've given everything to for 30 years fires you based on false and unproven sexual harrassment claims. Then my wife up and left me. My family didn't even ask for my side of the story and totally froze me out. Now I can't even pay a beautiful bride a compliment on her wedding day without getting slapped. Everyone always expects the worst from men - it's guilty until proven innocent now!\nYes, I brought the sword as a gift. It's a very expensive collector's item. But I didn't kill Angela with it!",
		"Character": "Bruce Babbage"
	}, {
		"Details": "I know having an affair with Angela was wrong. I felt so torn up with guilt about it. I don't know why I couldn't stop - I don't think I was in love with her, and I don't normally have any trouble with women. I think since kicking my addiction, I was looking for some other self-destructive outlet. I lived in fear of Andrew finding out - I'm sure my life would spiral again without his support.\nAngela told me last night that she was pregant and wanted to keep the baby. I was unhappy, knowing it was probably mine. I argued with her but she wouldn't back down. I stormed out of the room, but that was the last time I saw her. I didn't kill her - I didn't know that Andrew knew about the affair. I thought I had time to fix things - to end the affar and talk her out of having the baby.",
		"Character": "James Jeffrey"
	}, {
		"Details": "I've been in love with Andrew ever since I met him. My biggest regret is ever introducing him to Angela in the first place. It was so hard to see them together. It was the last straw for me when they got engaged. I decided to move overseas and try to forget about it and move on, but I couldn't. I cried and cried when the wedding invitation arrived in the mail and Angela asked me to be a bridesmaid.\nWhen Greg started hitting on me at the wedding, I thought I'd go along with it in the hopes that it might make Andrew jealous. \nI was furious when I caught Angela and James together during the reception. How could she do that to Andrew? She clearly has never loved him as much as I do. I went and told Andrew as soon as I could, and then returned to my room with a bottle to drown my sorrows. I can't remember anything past around 9:30pm but I couldn't have done this to Angela, no matter how angry I was. I think.",
		"Character": "Miranda Matthews"
	}, {
		"Character": "Greg Gray",
		"Details": "I've been unlucky in love in the past. I've suffered some brutal rejections and it's hurt my confidence. But when I saw Miranda, I knew she was the one. The way she teared up at the ceremony - I could tell she was a hopeless romantic at heart, just like me. \nAt the reception, I switched some name cards around so I'd be sitting closer to her. I was thrilled that she seemed to hit it off so quickly, until she disappeared. She told me she was just going to change her shoes and come right back, but I didn't see her again, despite looking everywhere. I began to worry that she was going to fly back overseas tomorrow and slip through my fingers.\nWhen I saw Andrew stumbling around outside drunk, I began to hatch a plan. If Angela died, surely Miranda wouldn't fly home straight away. I could see her again at the funeral, and be her shoulder to cry on. We'd bond over it.\nI helped Andrew back to a different room to Angela, to make sure she'd be alone. I went back to the reception hall after everyone had left to go find the sword that Bruce told me about. At least she was fast asleep when I found her."
	}],
	"Rounds": [{
		"Name": "Introduction",
		"Intro": "Yesterday, 200 of Andrew and Angela's friends and family gathered at a remote winery to celebrate their wedding. \nThis morning most of the guests have checked out and headed home. However, a small group of their closest loved ones remain behind for brunch at 12:00pm before the happy couple head off on their honeymoon. "
	}, {
		"Intro": "You've been waiting for an hour for the bride now and there's no sign of her. You're all hungry and getting grumpy. ",
		"Name": "Waiting"
	}, {
		"Intro": "It's an hour since you planned to meet and there's still no sign of the bride. You decide to split up and look for her. \nSeveral minutes pass and you hear someone cry out. You all hurriedly follow the voice to one of the hotel rooms, where the cousin has found her in one of the hotel rooms. She's on the bed, in a pool of dried blood with a sword jutting from her chest.\nYou're all shocked by the gorey scene and retreat to the hallway to discuss what you've seen.",
		"Name": "The Discovery"
	}, {
		"Name": "Questions",
		"Intro": "Andrew goes back into the bride's room and places a sheet over her body. You all enter and see if you can find any clues, while you wait for the police to arrive.\nAndrew made a shocking discovery in the bathroom...."
	}, {
		"Name": "The End",
		"Intro": "You think the police should arrive at any moment now.\nSomething sticking out of the bin in the bride's room catches Deborah's eye. She goes to inspect and pulls out a pregnancy test. "
	}],
	"Info": [{
		"Public": true,
		"Content": "You're Angela's cousin.",
		"Round": "Introduction",
		"Character": "Greg Gray"
	}, {
		"Content": "You're the same age but the two of you have never been very close.",
		"Character": "Greg Gray",
		"Round": "Introduction",
		"Public": true
	}, {
		"Round": "Introduction",
		"Character": "Greg Gray",
		"Public": true,
		"Content": "You're introverted and spend most of your time at home either gaming, on Reddit, or working on developing apps."
	}, {
		"Character": "Greg Gray",
		"Public": true,
		"Content": "You thought a wedding would be a good chance to get back out there after a few recent devastating romantic rejections",
		"Round": "Introduction"
	}, {
		"Round": "Introduction",
		"Public": false,
		"Content": "You always seem to fall in love too hard, too soon, and scare the girl away.",
		"Character": "Greg Gray"
	}, {
		"Content": "You knew Miranda was different as soon as you saw her. You're worried that she'll head back overseas and you'll miss your shot at love.",
		"Round": "Introduction",
		"Character": "Greg Gray",
		"Public": false
	}, {
		"Content": "You're Andrew's uncle, and Deborah's brother.",
		"Character": "Bruce Babbage",
		"Round": "Introduction",
		"Public": true
	}, {
		"Public": true,
		"Content": "You went through a pretty messy divorce last year and have been pretty down and withdrawn from your family ever since.",
		"Round": "Introduction",
		"Character": "Bruce Babbage"
	}, {
		"Public": true,
		"Content": "You weren't sure if you should come to the wedding at first, but then decided it would be nice to reconnect and have a bit of fun. God knows your ex-wife never let you have any fun!",
		"Round": "Introduction",
		"Character": "Bruce Babbage"
	}, {
		"Round": "Introduction",
		"Character": "Bruce Babbage",
		"Content": "You and your ex-wife used to get in some pretty heated arguments. She took out a restraining order against you before the divorce, claiming you used to beat her, which you think is an exaggeration.",
		"Public": false
	}, {
		"Character": "Bruce Babbage",
		"Public": false,
		"Round": "Introduction",
		"Content": "Sure, you hit her a few times, but she always started it."
	}, {
		"Content": "You were also recently fired from your cushy middle management job after some (made-up) sexual harrassment claims.",
		"Character": "Bruce Babbage",
		"Public": false,
		"Round": "Introduction"
	}, {
		"Public": false,
		"Round": "Introduction",
		"Character": "James Jeffrey",
		"Content": "You and Angela are having an affair. You're not in love with her or anything, and it's not like you have any trouble with women - so you know it's pretty self-destructive."
	}, {
		"Round": "Introduction",
		"Public": false,
		"Content": "You'd do anything to make sure Andrew never found out about the affair.",
		"Character": "James Jeffrey"
	}, {
		"Round": "Introduction",
		"Public": false,
		"Character": "James Jeffrey",
		"Content": "Andrew helped you out so much in the past with your addiction struggles, you think you'd spiral back out of control if you fell out with him."
	}, {
		"Public": true,
		"Round": "Introduction",
		"Content": "You're Andrew's best man.",
		"Character": "James Jeffrey"
	}, {
		"Public": true,
		"Character": "James Jeffrey",
		"Content": "The two of you met in high school and you've been as thick as thieves ever since. He's helped you through some difficult personal issues and you're very grateful for his constant support.",
		"Round": "Introduction"
	}, {
		"Character": "James Jeffrey",
		"Round": "Introduction",
		"Content": "You and Angela also get along really well and you're happy to see the two of them get married.",
		"Public": true
	}, {
		"Content": "You've been in love with Andrew ever since you met in uni.",
		"Public": false,
		"Round": "Introduction",
		"Character": "Miranda Matthews"
	}, {
		"Public": false,
		"Character": "Miranda Matthews",
		"Content": "You regret introducing him to Angela and you find it very painful to see them together - this a major reason why you moved overseas a few years ago.",
		"Round": "Introduction"
	}, {
		"Round": "Introduction",
		"Character": "Miranda Matthews",
		"Content": "You couldn't think of a good excuse to not come to the wedding. You thought at least you could rock a new hairstyle, a flattering dress, and try to make Andrew notice you and realise how much he's missed you.",
		"Public": false
	}, {
		"Public": true,
		"Round": "Introduction",
		"Content": "You're one of Angela's bridesmaids.",
		"Character": "Miranda Matthews"
	}, {
		"Public": true,
		"Content": "You introduced the bride and the groom originally.",
		"Round": "Introduction",
		"Character": "Miranda Matthews"
	}, {
		"Content": "You've been best friends with Angela since you were little, but you've drifted apart a little since you moved to London 3 years ago.",
		"Round": "Introduction",
		"Character": "Miranda Matthews",
		"Public": true
	}, {
		"Character": "Deborah Allen",
		"Content": "Your husband was awful to you and you hadn't been in love with him in years. However, you relied on him financially and worried about your relationship with your son if ever got divorced.",
		"Round": "Introduction",
		"Public": false
	}, {
		"Content": "You don't actually feel any grief, but it is nice to have so much attention from your beloved son. And the inheritance is a big plus.",
		"Character": "Deborah Allen",
		"Public": false,
		"Round": "Introduction"
	}, {
		"Character": "Deborah Allen",
		"Content": "You get a bad vibe from Angela, and you suspect she's just after your money.",
		"Public": false,
		"Round": "Introduction"
	}, {
		"Character": "Deborah Allen",
		"Round": "Introduction",
		"Public": true,
		"Content": "You're Andrew's mother. "
	}, {
		"Public": true,
		"Round": "Introduction",
		"Content": "Andrew is only your only son, and you're very close. He's been very supportive of you through as you grieve your husband's and his father's passing.",
		"Character": "Deborah Allen"
	}, {
		"Public": true,
		"Character": "Deborah Allen",
		"Content": "You married rich to Andrew's father. You have two siblings that you used to be close with, but you've been estranged from your brother for a while now.",
		"Round": "Introduction"
	}, {
		"Content": "You're excited to see your son get married and start the next chapter of his life, and possibly give you a grandchild or four. However, you know your son thinks with his heart and not his head, and you're not sure that Angela is the next match for him. You just want the best for Andrew.",
		"Round": "Introduction",
		"Public": true,
		"Character": "Deborah Allen"
	}, {
		"Character": "Andrew Allen",
		"Public": false,
		"Content": "One of your ex-girlfriends cheated on you in the past, and you were so enraged you broke the other guy's nose. You don't know what you'd do if it happened again with Angela.",
		"Round": "Introduction"
	}, {
		"Content": "Angela has seemed more and more withdrawn over the past few weeks and months. You're concerned that she was having cold feet or cheating on you.",
		"Round": "Introduction",
		"Character": "Andrew Allen",
		"Public": false
	}, {
		"Round": "Introduction",
		"Content": "You're lucky that your parents were able to pay for you to study, and introduce you to the right people in the industry to help you find your job. You're very close with your mother, Deborah, especially after your father died last year. You speak to her everyday.",
		"Character": "Andrew Allen",
		"Public": true
	}, {
		"Public": true,
		"Content": "James is your closest friend, and best man. You met in high school, went to the same university, and now both work as management consultants at rival firms.",
		"Character": "Andrew Allen",
		"Round": "Introduction"
	}, {
		"Round": "Introduction",
		"Content": "You're the groom. You met Angela in university after Miranda introduced you, and you've been together ever since. You proposed nearly two years ago, while on a holiday in Switzerland.",
		"Public": true,
		"Character": "Andrew Allen"
	}, {
		"Character": "Andrew Allen",
		"Round": "Waiting",
		"Public": true,
		"Content": "You're surprised that Bruce came to the wedding at all. His relationship with the rest of the family has been tense since his divorce."
	}, {
		"Round": "Waiting",
		"Character": "Andrew Allen",
		"Content": "You've tried calling the bride this morning but you haven't heard from her. You're not sure where she is.",
		"Public": true
	}, {
		"Round": "Waiting",
		"Character": "Andrew Allen",
		"Content": "You didn't actually spend the night in the honeymoon suite with the bride. You got a bit too drunk and someone helped you back to your room where you passed out.",
		"Public": false
	}, {
		"Character": "Andrew Allen",
		"Round": "Waiting",
		"Public": true,
		"Content": "You haven't met Greg before. You wonder how close he is to Angela and why he's at this 'intimate' brunch."
	}, {
		"Round": "Waiting",
		"Content": "You haven't opened any of your gifts yet. Someone must have packed all the presents in the car or a room somewhere.",
		"Public": false,
		"Character": "Andrew Allen"
	}, {
		"Round": "Waiting",
		"Public": true,
		"Content": "You haven't seen Bruce since his divorce. He didn't even come to your husband's funeral last year.",
		"Character": "Deborah Allen"
	}, {
		"Content": "You didn't see much of the bride at the wedding reception. You wonder if she's not up yet because she's not feeling very well.",
		"Public": true,
		"Character": "Deborah Allen",
		"Round": "Waiting"
	}, {
		"Content": "You saw Greg swapping the seating arrangement around at the start of the reception",
		"Character": "Deborah Allen",
		"Public": true,
		"Round": "Waiting"
	}, {
		"Content": "You think it's pretty rude that the bride is keeping you all waiting and letting the food go cold. She can be so self-centered.",
		"Round": "Waiting",
		"Public": true,
		"Character": "Deborah Allen"
	}, {
		"Public": false,
		"Content": "You look great in white, and you're not going to let some arbitrary rule stop you from wearing it.",
		"Round": "Waiting",
		"Character": "Deborah Allen"
	}, {
		"Character": "Deborah Allen",
		"Content": "You basically planned the entire wedding. You didn't think the bride was up to the task, and besides, you were the one paying for everything!",
		"Round": "Waiting",
		"Public": false
	}, {
		"Content": "You got pretty drunk last night. You've got a splitting headache and you have a pretty patchy memory of last night.",
		"Character": "Miranda Matthews",
		"Round": "Waiting",
		"Public": true
	}, {
		"Round": "Waiting",
		"Character": "Miranda Matthews",
		"Content": "You remember James was a player back in uni. You wonder why he didn't bring a date to the wedding.",
		"Public": true
	}, {
		"Character": "Miranda Matthews",
		"Public": true,
		"Round": "Waiting",
		"Content": "The bride confided in you that she was frustrated that Deborah was being controlling and taking over all the wedding planning"
	}, {
		"Round": "Waiting",
		"Character": "Miranda Matthews",
		"Public": true,
		"Content": "You remember Deborah wore white to the wedding last night. What a faux pas."
	}, {
		"Public": false,
		"Round": "Waiting",
		"Content": "You and Greg are not a couple. Gross! At least you're flying back to London tomorrow so you don't need to see him again after this.",
		"Character": "Miranda Matthews"
	}, {
		"Public": false,
		"Character": "Miranda Matthews",
		"Round": "Waiting",
		"Content": "You met Andrew in uni and used to hook up occasionally, but that stopped after you introduced him to the bride and they fell for each other."
	}, {
		"Public": true,
		"Content": "You found Andrew stumbling around drunk late last night in the garden and you helped him get back to his room and to bed.",
		"Round": "Waiting",
		"Character": "Greg Gray"
	}, {
		"Public": false,
		"Character": "Greg Gray",
		"Content": "You moved seats around to get closer to Miranda at the reception",
		"Round": "Waiting"
	}, {
		"Round": "Waiting",
		"Public": false,
		"Content": "You admit you weren't technically invited to this brunch, but you're family. Your invite must have just got lost in the mail.",
		"Character": "Greg Gray"
	}, {
		"Round": "Waiting",
		"Character": "Greg Gray",
		"Public": false,
		"Content": "You're optimistic that the romance between you and Miranda last night will develop into a committed relationship, if she didn't have to fly back to London so soon."
	}, {
		"Round": "Waiting",
		"Content": "You spoke to Bruce during the reception. He mentioned that he's an avid collector of swords and bought the newlyweds a Japanese katana as a wedding gift. Cool.",
		"Public": true,
		"Character": "Greg Gray"
	}, {
		"Character": "Bruce Babbage",
		"Content": "You couldn't find your jacket at the end of last night. Someone must have taken it from the table by mistake.",
		"Round": "Waiting",
		"Public": true
	}, {
		"Content": "You notice Greg doting over Miranda this morning and saw the two of them together last night. You ask if they're a couple.",
		"Public": true,
		"Character": "Bruce Babbage",
		"Round": "Waiting"
	}, {
		"Character": "Bruce Babbage",
		"Round": "Waiting",
		"Content": "You wonder if the groom had a good time with the bride last night. Wink wink.",
		"Public": true
	}, {
		"Content": "You didn't go to your brother-in-law's funeral because you didn't want to see the family. You suspect your ex-wife manipulated them all to take her side in the divorce",
		"Character": "Bruce Babbage",
		"Round": "Waiting",
		"Public": false
	}, {
		"Character": "Bruce Babbage",
		"Round": "Waiting",
		"Content": "You were fired from your job last year after a couple of the young girls made up some bullshit accusations about you. ",
		"Public": false
	}, {
		"Content": "You recognise Bruce from work. There were some rumours floating around the office about sexual harrassment allegations against him a while ago.",
		"Character": "James Jeffrey",
		"Public": true,
		"Round": "Waiting"
	}, {
		"Character": "James Jeffrey",
		"Round": "Waiting",
		"Content": "Miranda looks familiar to you. You think she might have been one of Andrew's friends at uni.",
		"Public": true
	}, {
		"Round": "Waiting",
		"Public": true,
		"Content": "You notice the gifts are no longer at the table from last night. You wonder if the couple received anything exciting.",
		"Character": "James Jeffrey"
	}, {
		"Round": "Waiting",
		"Character": "James Jeffrey",
		"Public": true,
		"Content": "You saw Andrew taking a piss out in the garden from your window last night before Greg came out and brought him back inside."
	}, {
		"Round": "Waiting",
		"Public": false,
		"Content": "You didn't bring a date to the wedding because you thought you might be able to pick up at the wedding",
		"Character": "James Jeffrey"
	}, {
		"Round": "The Discovery",
		"Content": "You wonder how the groom's father died",
		"Character": "Greg Gray",
		"Public": true
	}, {
		"Round": "The Discovery",
		"Character": "Greg Gray",
		"Public": true,
		"Content": "Miranda disappeared last night without saying anything to you. You spent a while looking for her unsuccessfully before going to bed."
	}, {
		"Round": "The Discovery",
		"Public": true,
		"Content": "Deborah didn't seen to have anything nice to say about the bride in her speech at the reception",
		"Character": "Greg Gray"
	}, {
		"Public": false,
		"Character": "Greg Gray",
		"Round": "The Discovery",
		"Content": "You ran into the bride in the hallway last night and asked her for Miranda's phone number so you could track her down. She was already upset when you approached her and refused to share her phone number."
	}, {
		"Content": "Your friends asked you a few times last night if you'd seen James. He seemed to disappear for a while in the middle of the reception.",
		"Character": "Andrew Allen",
		"Public": true,
		"Round": "The Discovery"
	}, {
		"Public": true,
		"Character": "Andrew Allen",
		"Round": "The Discovery",
		"Content": "You saw Greg following Miranda around during the whole reception like a love-sick puppy"
	}, {
		"Round": "The Discovery",
		"Public": true,
		"Character": "Andrew Allen",
		"Content": "You saw Miranda swipe a bottle from behind the bar during the reception last night and leave with it"
	}, {
		"Round": "The Discovery",
		"Content": "Your father died of a sudden and unexpected allergic reaction. Your family didn't realise he had any allergies beforehand.",
		"Public": false,
		"Character": "Andrew Allen"
	}, {
		"Character": "Andrew Allen",
		"Public": false,
		"Round": "The Discovery",
		"Content": "You admit you were worried for a while before the wedding that the bride was getting cold feet. She denied it, but you weren't convinced"
	}, {
		"Content": "Andrew confided in you that he worried that the bride was getting cold feet. She seemed withdrawn over the past few weeks.",
		"Character": "James Jeffrey",
		"Round": "The Discovery",
		"Public": true
	}, {
		"Character": "James Jeffrey",
		"Content": "You noticed Miranda tearing up during the wedding ceremony.",
		"Public": true,
		"Round": "The Discovery"
	}, {
		"Round": "The Discovery",
		"Public": true,
		"Content": "You saw Bruce in the bathroom popping pills. He quickly put the bottle back in his jacket pocket when he saw you.",
		"Character": "James Jeffrey"
	}, {
		"Round": "The Discovery",
		"Content": "You went back to a woman's room with them during the reception",
		"Character": "James Jeffrey",
		"Public": false
	}, {
		"Character": "Deborah Allen",
		"Round": "The Discovery",
		"Public": true,
		"Content": "While they were dancing together, you noticed Miranda looking over Greg's shoulder at the groom constantly."
	}, {
		"Round": "The Discovery",
		"Character": "Deborah Allen",
		"Content": "You only spiked the bride's drink with gluten to see if it gave her a reaction. You thought she was faking coeliac's disease for attention anyway.",
		"Public": false
	}, {
		"Round": "The Discovery",
		"Content": "Your speech at the wedding was all about how much you love your son. If you didn't mention the bride, it's because your mother always used to tell you, \"if you don't have anything nice to say, don't say anything at all\"",
		"Public": false,
		"Character": "Deborah Allen"
	}, {
		"Public": true,
		"Round": "The Discovery",
		"Content": "You saw Bruce spending most of the night at the bar trying to talk to younger women",
		"Character": "Deborah Allen"
	}, {
		"Character": "Bruce Babbage",
		"Round": "The Discovery",
		"Content": "You saw the groom's mother drop something into the bride's glass of wine in between courses while people were away mingling",
		"Public": true
	}, {
		"Round": "The Discovery",
		"Content": "You saw Greg and bride arguing in the hallway during the reception. You think you heard something about a phone number. Greg seemed very persistent.",
		"Character": "Bruce Babbage",
		"Public": true
	}, {
		"Round": "The Discovery",
		"Content": "You took a few painkillers during the reception. You've got back problems and the chairs were so uncomfortable at the ceremony",
		"Character": "Bruce Babbage",
		"Public": false
	}, {
		"Content": "The bride and her friends all seemed pretty rude last night. You tried to speak to a few at the bar but they clearly thought they were too good to talk to you",
		"Character": "Bruce Babbage",
		"Round": "The Discovery",
		"Public": false
	}, {
		"Public": true,
		"Character": "Miranda Matthews",
		"Content": "Bruce made a lewd remark about your ass at the bar during the reception. You saw the creep harrass other friends of the bride as well.",
		"Round": "The Discovery"
	}, {
		"Character": "Miranda Matthews",
		"Content": "You thought Deborah's speech at the reception was pretty passive aggressive",
		"Round": "The Discovery",
		"Public": true
	}, {
		"Public": true,
		"Content": "You didn't see the bride drinking at all yesterday. She didn't really seem like herself.",
		"Character": "Miranda Matthews",
		"Round": "The Discovery"
	}, {
		"Public": false,
		"Round": "The Discovery",
		"Content": "You did shed a few tears at the ceremony. You don't think it's unusual to tear up at a wedding.",
		"Character": "Miranda Matthews"
	}, {
		"Public": false,
		"Content": "You took Bruce's jacket from the back of his chair so you could steal a few of his pills from the bottle in his pocket.",
		"Character": "James Jeffrey",
		"Round": "Questions"
	}, {
		"Round": "Questions",
		"Content": "You admit to having an affair with the bride, but you deny that you stormed out of the room angrily. You were upset with yourself and feeling guilty.",
		"Character": "James Jeffrey",
		"Public": false
	}, {
		"Character": "James Jeffrey",
		"Content": "You noticed that Miranda wore purple lipstick to the wedding yesterday",
		"Public": true,
		"Round": "Questions"
	}, {
		"Character": "James Jeffrey",
		"Content": "You saw an argument between Bruce and the bride near the bar early in the reception. You were on your way over to calm things down when she slapped Bruce and stormed out.",
		"Public": true,
		"Round": "Questions"
	}, {
		"Character": "Andrew Allen",
		"Content": "James seemed pretty on edge during the wedding. You were concerned that he was using drugs again.",
		"Public": true,
		"Round": "Questions"
	}, {
		"Content": "Miranda cornered you late during the reception late last night. She was so drunk that she was barely coherent but she told you that the bride and James were having an affair.",
		"Round": "Questions",
		"Public": true,
		"Character": "Andrew Allen"
	}, {
		"Public": false,
		"Round": "Questions",
		"Content": "You tried to look for the bride after you spoke to Miranda to hear her side of the story but she was nowhere to be found. You went back and had a few more drinks with the boys instead.",
		"Character": "Andrew Allen"
	}, {
		"Content": "You saw an uncomfortable exchange between the bride and Bruce at the bar. You saw him grope her, and her storm off after slapping him in the face.",
		"Character": "Deborah Allen",
		"Public": true,
		"Round": "Questions"
	}, {
		"Content": "Your husband's death was unexpected, but it wasn't suspicious. The police cleared you of any wrongdoing.",
		"Public": false,
		"Character": "Deborah Allen",
		"Round": "Questions"
	}, {
		"Public": true,
		"Round": "Questions",
		"Character": "Deborah Allen",
		"Content": "Your ex-sister-in-law confided in you about Bruce's abuse after the divorce. She showed you a horrible picture of her face after one of their fights. She had a nasty black eye, a split lip, and bruises across her cheekbones."
	}, {
		"Character": "Greg Gray",
		"Round": "Questions",
		"Content": "You saw James later in the reception wearing a different jacket than earlier.",
		"Public": true
	}, {
		"Public": false,
		"Content": "You saw Bruce make a remark about Miranda's body at the bar. You couldn't just stand by and let him get away with harrassing your girl!",
		"Character": "Greg Gray",
		"Round": "Questions"
	}, {
		"Content": "While looking for Miranda last night, you noticed James storm angrily down the hallway, away from the room the room that the bride was found in.",
		"Public": true,
		"Character": "Greg Gray",
		"Round": "Questions"
	}, {
		"Character": "Greg Gray",
		"Round": "Questions",
		"Content": "Deborah seemed to spend most of the night sitting at the table, looking sulky.",
		"Public": true
	}, {
		"Content": "You went back to your room during the reception to change into flat shoes after getting blisters from your heels. On the way, you noticed the bride and James hooking up the bride's room with the door ajar.",
		"Character": "Miranda Matthews",
		"Round": "Questions",
		"Public": true
	}, {
		"Round": "Questions",
		"Public": true,
		"Character": "Miranda Matthews",
		"Content": "After seeing the bride and James together, you stormed back to the reception to tell the groom immediately and then swiped a bottle from the bar and took it back to your room with you"
	}, {
		"Character": "Miranda Matthews",
		"Public": false,
		"Content": "You did wear purple lipstick last night, but you don't remember going into the bride's room",
		"Round": "Questions"
	}, {
		"Round": "Questions",
		"Public": false,
		"Character": "Bruce Babbage",
		"Content": "You admit you got into a pretty serious row with you ex-wife just before the divorce, but she definitely started it! Women never tell you that part of the story."
	}, {
		"Round": "Questions",
		"Public": false,
		"Character": "Bruce Babbage",
		"Content": "You just tried to give the bride a compliment last night and she thanked you for it by slapping you in the face. You can't say anything these days."
	}, {
		"Content": "Greg yelled at you and threatened your during the reception for no reason.",
		"Round": "Questions",
		"Character": "Bruce Babbage",
		"Public": true
	}, {
		"Public": true,
		"Round": "Questions",
		"Content": "Your other sister told you a while ago that she was suspicious about Deborah's husband's sudden death last year",
		"Character": "Bruce Babbage"
	}, {
		"Content": "You didn't want Andrew to find out that you were having an affair with the bride. He's possessive and jealous and you knew his reaction wouldn't be good.",
		"Round": "The End",
		"Public": true,
		"Character": "James Jeffrey"
	}, {
		"Content": "Deborah always suspected that the bride was just after your family's money",
		"Character": "Andrew Allen",
		"Public": true,
		"Round": "The End"
	}, {
		"Public": true,
		"Round": "The End",
		"Content": "You thought it might take Andrew years of trying to become a father. He had a pretty... traumatic injury as a teenager.",
		"Character": "Deborah Allen"
	}, {
		"Content": "You really just strung Greg along last night in an attempt to make Andrew jealous and notice you",
		"Round": "The End",
		"Public": true,
		"Character": "Miranda Matthews"
	}, {
		"Character": "Bruce Babbage",
		"Public": true,
		"Round": "The End",
		"Content": "You saw Greg looking through the pile of wedding gifts late last night."
	}, {
		"Public": true,
		"Round": "The End",
		"Character": "Greg Gray",
		"Content": "When you helped drunken Andrew back to his room last night he was muttering about the bride being a slut"
	}],
	"ID": "skye is cool as",
	"SheetID": "1lEn5RXInYnt-arhiA4t0_0Cr97rO6RrQ94rK39s8RUE",
	"TimelineEvents": [{
		"Time": "15:00",
		"Event": "Wedding Ceremony",
		"Character": "Andrew Allen"
	}, {
		"Event": "Wedding Ceremony",
		"Time": "15:00",
		"Character": "Deborah Allen"
	}, {
		"Character": "Miranda Matthews",
		"Time": "15:00",
		"Event": "Wedding Ceremony"
	}, {
		"Event": "Wedding Ceremony",
		"Character": "James Jeffrey",
		"Time": "15:00"
	}, {
		"Character": "Greg Gray",
		"Time": "15:00",
		"Event": "Wedding Ceremony"
	}, {
		"Time": "15:00",
		"Event": "Wedding Ceremony",
		"Character": "Bruce Babbage"
	}, {
		"Time": "17:00",
		"Character": "Andrew Allen",
		"Event": "Away taking wedding photos"
	}, {
		"Time": "17:00",
		"Character": "Deborah Allen",
		"Event": "Away taking wedding photos"
	}, {
		"Time": "17:00",
		"Character": "Miranda Matthews",
		"Event": "Away taking wedding photos"
	}, {
		"Event": "Away taking wedding photos",
		"Character": "James Jeffrey",
		"Time": "17:00"
	}, {
		"Event": "Went to wedding reception",
		"Character": "Greg Gray",
		"Time": "17:00"
	}, {
		"Character": "Bruce Babbage",
		"Event": "Went to wedding reception",
		"Time": "17:00"
	}, {
		"Time": "17:30",
		"Character": "Deborah Allen",
		"Event": "Returned to reception"
	}, {
		"Time": "17:30",
		"Character": "Miranda Matthews",
		"Event": "Returned to reception"
	}, {
		"Character": "James Jeffrey",
		"Event": "Returned to reception",
		"Time": "17:30"
	}, {
		"Character": "Andrew Allen",
		"Time": "18:00",
		"Event": "Returned to reception"
	}, {
		"Character": "Andrew Allen",
		"Event": "At table, for dinner and speeches",
		"Time": "18:30"
	}, {
		"Event": "Gave a speech at the reception",
		"Character": "Deborah Allen",
		"Time": "18:30"
	}, {
		"Time": "18:30",
		"Character": "Miranda Matthews",
		"Event": "At table, for dinner and speeches"
	}, {
		"Time": "18:30",
		"Character": "James Jeffrey",
		"Event": "At table, for dinner and speeches"
	}, {
		"Event": "At table, for dinner and speeches",
		"Time": "18:30",
		"Character": "Greg Gray"
	}, {
		"Event": "At table, for dinner and speeches",
		"Time": "18:30",
		"Character": "Bruce Babbage"
	}, {
		"Character": "Deborah Allen",
		"Time": "19:00",
		"Event": "At table, eating dinner"
	}, {
		"Character": "Deborah Allen",
		"Event": "At table, socialising with family",
		"Time": "19:30"
	}, {
		"Event": "Dancing and drinking with Greg",
		"Time": "19:30",
		"Character": "Miranda Matthews"
	}, {
		"Time": "19:30",
		"Character": "Greg Gray",
		"Event": "Dancing and drinking with Miranda"
	}, {
		"Event": "At the bar, socialising",
		"Time": "19:30",
		"Character": "Bruce Babbage"
	}, {
		"Character": "James Jeffrey",
		"Time": "20:00",
		"Event": "Left the reception with someone"
	}, {
		"Event": "Went back to your room",
		"Character": "Miranda Matthews",
		"Time": "20:30"
	}, {
		"Time": "21:00",
		"Character": "Andrew Allen",
		"Event": "Spoke to Miranda"
	}, {
		"Character": "Miranda Matthews",
		"Time": "21:00",
		"Event": "Returned to reception briefly, before calling it a night early"
	}, {
		"Time": "21:00",
		"Event": "Looked around for the bridesmaid",
		"Character": "Greg Gray"
	}, {
		"Event": "Returned to the reception",
		"Time": "21:30",
		"Character": "James Jeffrey"
	}, {
		"Character": "Deborah Allen",
		"Event": "Returned to room",
		"Time": "22:00"
	}, {
		"Character": "James Jeffrey",
		"Time": "23:00",
		"Event": "Returned to room"
	}, {
		"Event": "Returned to room",
		"Time": "23:00",
		"Character": "Bruce Babbage"
	}, {
		"Event": "Left reception",
		"Time": "0:00",
		"Character": "Greg Gray"
	}, {
		"Character": "Andrew Allen",
		"Time": "0:30",
		"Event": "Was escorted back to room"
	}, {
		"Character": "Greg Gray",
		"Event": "Saw Andrew outside in the garden, drunk. Helped him to his room.",
		"Time": "0:30"
	}, {
		"Event": "Went back to room",
		"Time": "1:00",
		"Character": "Greg Gray"
	}],
	"Clues": [{
		"URL": {
			"Path": "",
			"RawPath": "",
			"Host": "test.com",
			"ForceQuery": false,
			"RawQuery": "",
			"Scheme": "http",
			"Opaque": "",
			"User": null,
			"Fragment": ""
		},
		"Round": "Questions",
		"Description": "You went to check the bathroom in the bride's room and were shocked to see something written on the mirror",
		"CharacterName": "Andrew Allen",
		"Name": "The Mirror"
	}, {
		"CharacterName": "Deborah Allen",
		"Description": "You see something odd in the garbage bin and go take a closer look",
		"Name": "The Bin",
		"Round": "The End",
		"URL": {
			"RawPath": "",
			"Opaque": "",
			"Host": "test.com",
			"User": null,
			"ForceQuery": false,
			"RawQuery": "",
			"Scheme": "http",
			"Path": "",
			"Fragment": ""
		}
	}],
	"Characters": [{
		"Accessories": "Quirky socks",
		"Name": "Andrew Allen",
		"Blurb": "Angela's husband. 29 years old.",
		"Costume": "A neat button-down shirt and chinos."
	}, {
		"Accessories": "Brooch",
		"Costume": "Conservative, matronly yet expensive-looking outfit. A cardigan and blouse.",
		"Name": "Deborah Allen",
		"Blurb": "Andrew's mother. 59 years old."
	}, {
		"Accessories": "Smeared makeup from the night before.",
		"Blurb": "One of Angela's bridesmaids. 28 years ago.",
		"Name": "Miranda Matthews",
		"Costume": "A casual but slightly disheveled outfit, such as jeans and a loose jumper. "
	}, {
		"Name": "James Jeffrey",
		"Costume": "Casual, fashionable outfit. Jeans or chinos with a button-down shirt.",
		"Blurb": "Andrew's best man. 30 years old.",
		"Accessories": "Fancy watch and dress shoes."
	}, {
		"Blurb": "Angela's cousin. 28 years old.",
		"Name": "Greg Gray",
		"Costume": "Graphic t-shirt and jeans. Slightly worn sneakers.",
		"Accessories": "Glasses"
	}, {
		"Costume": "Hawaiian shirt (not ironically). Cargo pants or shorts and sandals.",
		"Blurb": "Deborah's brother and Andrew's uncle. 63 years old.",
		"Name": "Bruce Babbage",
		"Accessories": "Gold chain"
	}]
}`;
