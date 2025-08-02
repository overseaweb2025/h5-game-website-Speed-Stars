import type { Metadata } from "next";
import { getUserBySlug, getAllUserSlugs } from "@/data/users/users-data";

interface UserLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const userSlugs = getAllUserSlugs();
  return userSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: UserLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const user = getUserBySlug(slug);
  
  if (!user) {
    return {
      title: "User Not Found - GameHub Central",
      description: "The requested user profile could not be found.",
    };
  }
  
  return {
    title: `${user.profile.name} - GameHub Central`,
    description: `View ${user.profile.name}'s profile, game history, favorites, and achievements on GameHub Central.`,
    openGraph: {
      title: `${user.profile.name} - GameHub Central`,
      description: `Level ${user.profile.level} gamer with ${user.stats.totalGamesPlayed} games played and ${user.stats.achievementsCount} achievements.`,
      type: 'profile',
    },
  };
}

export default function UserLayout({ children }: UserLayoutProps) {
  return <>{children}</>;
}