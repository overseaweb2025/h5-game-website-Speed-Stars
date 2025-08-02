export interface HeroData {
  title: {
    main: string;
    subtitle: string;
  };
  gameIframeSrc: string;
  buttons: {
    primary: string;
    secondary: string;
  };
  description: {
    main: string;
    sub: string;
  };
}

export const heroData: HeroData = {
  title: {
    main: "Speed Star unblocked",
    subtitle: ": Running Game"
  },
  gameIframeSrc: "https://speedstars2.io/game/speed-stars/",
  buttons: {
    primary: "Play Online for Free!",
    secondary: "Explore Games"
  },
  description: {
    main: "Experience the exhilaration of high-stakes sprinting in this free online game.",
    sub: "Play unblocked on any device with no downloads required!"
  }
};