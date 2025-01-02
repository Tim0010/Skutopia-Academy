import { HeroSection } from "@/features/landing/sections/hero-section";
import { FeaturedCourses } from "@/features/landing/sections/featured-courses";
import { SuccessStories } from "../../components/landing/success-stories";
import { PlatformBenefits } from "@/features/landing/sections/platform-benefits";
import { QuickStartGuide } from "@/features/landing/sections/quick-start-guide";
import { NewsUpdates } from "@/features/landing/sections/news-updates";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      <HeroSection />
      <FeaturedCourses />
      <SuccessStories />
      <PlatformBenefits />
      <QuickStartGuide />
      <NewsUpdates />
      <Footer />
    </div>
  );
}
