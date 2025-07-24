import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Games from "@/components/games";
import HowToPlay from "@/components/how-to-play";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import SpeedStarsSection from "@/components/speed-stars-section";
import GameplaySection from "@/components/gameplay-section";
import { getGameBySlug, getAllGameSlugs } from "@/data/games/games-data";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/data/blog/blog-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const gameSlugs = getAllGameSlugs();
  const blogSlugs = getAllBlogSlugs();
  
  return [
    ...gameSlugs.map((slug) => ({ slug })),
    ...blogSlugs.map((slug) => ({ slug })),
    { slug: "about" },
    { slug: "contact" },
    { slug: "help" },
    { slug: "privacy" },
    { slug: "terms" },
    { slug: "cookies" },
    { slug: "dmca" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Check if it's a game
  const game = getGameBySlug(slug);
  if (game) {
    return {
      title: `${game.title} - Speed Stars`,
      description: game.description,
    };
  }
  
  // Check if it's a blog post
  const blogPost = getBlogPostBySlug(slug);
  if (blogPost) {
    return {
      title: `${blogPost.title} - Speed Stars Blog`,
      description: blogPost.description,
    };
  }
  
  // Default metadata for other pages
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Speed Stars`,
    description: "Speed Stars - The ultimate physics-based running game experience",
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Check if it's a game or blog post that should be handled differently
  const game = getGameBySlug(slug);
  const blogPost = getBlogPostBySlug(slug);
  
  if (game || blogPost) {
    // These should be handled by their specific routes
    notFound();
  }
  
  // For all other slugs, return the home page layout
  return (
    <main>
      <Header />
      <Hero />
      <Games />
      <SpeedStarsSection />
      <GameplaySection />
      <Features />
      <HowToPlay />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}