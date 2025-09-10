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
    main: "",
    subtitle: ""
  },
  gameIframeSrc: "",
  buttons: {
    primary: "Play Online for Free!",
    secondary: "Explore Games"
  },
  description: {
    main: "",
    sub: ""
  }
};
