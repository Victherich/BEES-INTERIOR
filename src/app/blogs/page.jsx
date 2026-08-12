"use client";

import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

/* ================= COLORS ================= */

const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";

/* ================= STYLED COMPONENTS ================= */

const PageContainer = styled.div`
  font-family: inherit;
  color: ${Dark};
  background: ${White};
  overflow-x: hidden;
`;

/* --- Hero Section --- */
const HeroSection = styled.section`
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${Dark};
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.65);
    z-index: 1;
  }
`;

const HeroImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: ${White};
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: ${Border};
  line-height: 1.6;
`;

/* --- Blog Content Section --- */
const BlogSection = styled.section`
  max-width: 1200px;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(Link)`
  background: ${White};
  border-radius: 10px;
  border: 1px solid ${Border};
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }
`;

const BlogImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
`;

const BlogInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: ${TextMuted};
`;

const BlogCategory = styled.span`
  background: rgba(37, 99, 235, 0.1);
  color: ${Blue};
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
`;

const BlogTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${Dark};
  line-height: 1.4;
`;

const BlogExcerpt = styled.p`
  color: ${TextMuted};
  font-size: 0.95rem;
  line-height: 1.6;
`;

/* ================= BLOG DATA ================= */

const blogs = [
  {
    id: 1,
    slug: "modern-minimalist-trends-2026",
    title: "Modern Minimalist Interior Trends to Watch in 2026",
    excerpt: "Discover how clean lines, warm earth tones, and sustainable materials are shaping modern luxury living spaces this year.",
    category: "Trends",
    date: "June 12, 2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "choosing-the-right-lighting",
    title: "The Ultimate Guide to Layered Lighting in Luxury Homes",
    excerpt: "Learn how to combine ambient, task, and accent lighting to transform the mood and functionality of every room.",
    category: "Design Tips",
    date: "May 28, 2026",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "small-space-big-impact",
    title: "How to Make Small Spaces Feel Grand and Sophisticated",
    excerpt: "Smart spatial planning, reflective surfaces, and bespoke furnishings can make compact rooms look breathtaking.",
    category: "Architecture",
    date: "May 15, 2026",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "incorporating-gold-accents",
    title: "Elevating Your Decor with Subtle Gold and Metallic Accents",
    excerpt: "Find out how to strike the right balance using metallic touches for a high-end, sophisticated aesthetic without clutter.",
    category: "Decor",
    date: "April 30, 2026",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "sustainable-luxurious-materials",
    title: "Eco-Luxury: Sustainable Materials in High-End Design",
    excerpt: "Explore how organic woods, recycled stones, and non-toxic textiles are defining the future of ethical luxury interiors.",
    category: "Sustainability",
    date: "April 14, 2026",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "master-bedroom-sanctuary",
    title: "Creating the Ultimate Master Bedroom Sanctuary",
    excerpt: "Turn your bedroom into a peaceful haven of relaxation with plush bedding, acoustic paneling, and curated tones.",
    category: "Lifestyle",
    date: "March 22, 2026",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop",
  },
];

/* ================= COMPONENT ================= */

export default function BlogsPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroImageWrapper>
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Bees Interior Blogs"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </HeroImageWrapper>
        <HeroContent>
          <HeroTitle>
            Design Insights & <span>Inspiration</span>
          </HeroTitle>
          <HeroSubtitle>
            Explore expert tips, industry trends, and deep dives into luxury interior architecture crafted by the Bees Interior team.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Blogs Grid Section */}
      <BlogSection>
        <BlogGrid>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} href={`/blogs/${blog.slug}`}>
              <BlogImageWrapper>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </BlogImageWrapper>
              <BlogInfo>
                <BlogMeta>
                  <BlogCategory>{blog.category}</BlogCategory>
                  <span>{blog.date}</span>
                </BlogMeta>
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
              </BlogInfo>
            </BlogCard>
          ))}
        </BlogGrid>
      </BlogSection>
    </PageContainer>
  );
}