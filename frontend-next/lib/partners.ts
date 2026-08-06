export type Partner = {
  slug: string;
  logo: string;
  name: string;
  shortDescription: string;
  heroTitle: string;
  detailTitle: string;
  description: string;
  sections: {
    heading: string;
    body: string;
  }[];
  moreInfo?: {
    label: string;
    href?: string;
  }[];
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    mapQuery?: string;
  };
  website?: string;
};

export const partners: Partner[] = [
  {
    slug: "praxis-school-borderless-learning",
    logo: "/images/directory-praxis.svg",
    name: "Praxis School - A Student-Centred Online IEB School",
    shortDescription: "Praxis Online School is part of a group of experienced providers providing excellence in Education.",
    heroTitle: "Praxis School-Borderless Learning",
    detailTitle: "Praxis School - A Student-Centred Online IEB School",
    description:
      "Praxis School is a fully registered IEB virtual school offering a full academic timetable from 07:45 to 14:00, with live teacher interaction and dedicated subject specialists across all grades. Their online classrooms are small and interactive, allowing for individual attention and personalised academic support.",
    sections: [
      {
        heading: "Praxis Borderless Learning",
        body:
          "Praxis supports families who need a structured online school environment with live lessons, academic guidance, and consistent classroom routines. The school focuses on keeping learners connected while giving families the flexibility of online education.",
      },
    ],
    moreInfo: [
      {
        label: "Past Papers",
      },
      {
        label: "Website: praxisschools.com",
        href: "https://praxisschools.com",
      },
    ],
    contact: {
      phone: "+27 11 660 7584",
      email: "info@praxisonline.co.za",
      address: "73 Lawrence Road, Poortview, Roodepoort",
      mapQuery: "73 Lawrence Road Poortview Roodepoort South Africa",
    },
    website: "https://praxisschools.com",
  },
  {
    slug: "bellavista-share",
    logo: "/images/directory-bellavista.svg",
    name: "Bellavista S.H.A.R.E",
    shortDescription:
      "Bellavista S.H.A.R.E. harnesses the capacity of staff and education thought leaders to improve educational delivery in Southern Africa.",
    heroTitle: "Bellavista S.H.A.R.E",
    detailTitle: "Bellavista S.H.A.R.E",
    description:
      "With the Bellavista S.H.A.R.E. initiative, Bellavista School harnesses the collective capacity held within its own staff and among thought leaders in the industry to improve the quality of educational delivery in Southern Africa.",
    sections: [
      {
        heading: "Education Resource Centre",
        body:
          "Bellavista S.H.A.R.E. offers training, talks, workshops, and support for teachers, therapists, parents, and professionals who work with children. Their work focuses on learning support, cognitive education, and practical classroom strategies.",
      },
    ],
    moreInfo: [
      {
        label: "Website: bellavista.org.za",
        href: "https://bellavista.org.za/Bellavista-share/",
      },
    ],
    website: "https://bellavista.org.za/Bellavista-share/",
  },
  {
    slug: "conquesta-academic-annual-school-olympiads",
    logo: "/images/directory-conquesta.svg",
    name: "Conquesta Academic Annual School Olympiads",
    shortDescription:
      "Annual multiple choice Olympiads for grades 1-9 students across South Africa, Namibia, Botswana and eSwatini.",
    heroTitle: "Conquesta Academic Annual School Olympiads",
    detailTitle: "Conquesta Academic Annual School Olympiads",
    description:
      "Conquesta provides annual multiple-choice Olympiads for grades 1-9 students across South Africa, Namibia, Botswana and eSwatini in both English and Afrikaans. New papers are set each year by carefully selected teachers who are professionals in their respective fields.",
    sections: [
      {
        heading: "Academic Challenges For Homeschoolers",
        body:
          "The Olympiads give learners a structured opportunity to test their knowledge, practise problem-solving, and gain confidence through external academic challenges. They are designed to be accessible for schools and homeschooling families.",
      },
      {
        heading: "Past Papers And Preparation",
        body:
          "Families can use Conquesta past papers to prepare learners for the format and style of the questions. Certificates and feedback help parents identify strengths and areas that may need more attention.",
      },
    ],
    moreInfo: [
      {
        label: "Olympiads: conquestaolympiads.com",
        href: "https://www.conquestaolympiads.com/",
      },
      {
        label: "Past Papers: conquestapastpapers.com",
        href: "https://www.conquestapastpapers.com/",
      },
    ],
    contact: {
      phone: "031 764 1972",
      email: "admin@conquestaolympiads.com",
    },
    website: "https://www.conquestaolympiads.com/",
  },
  {
    slug: "the-answer-series",
    logo: "/images/directory-answer-series.svg",
    name: "The Answer Series",
    shortDescription:
      "South Africa's leading provider of study guides, supporting learners, parents, teachers, and tutors for more than 50 years.",
    heroTitle: "The Answer Series",
    detailTitle: "The Answer Series",
    description:
      "The Answer Series, fondly known as TAS, is South Africa's leading provider of study guides. For more than 50 years, TAS has supported learners, parents, teachers, and tutors with high-quality, easy-to-use resources designed to build confidence and support exam success.",
    sections: [
      {
        heading: "Study Guides And Support",
        body:
          "The Answer Series creates curriculum-aligned study material that helps learners revise, practise, and understand key concepts. Their resources are useful for independent study, tutoring, classroom support, and homeschooling.",
      },
    ],
    moreInfo: [
      {
        label: "Website: theanswer.co.za",
        href: "https://www.theanswer.co.za/",
      },
    ],
    website: "https://www.theanswer.co.za/",
  },
  {
    slug: "cambridge",
    logo: "/images/directory-cambridge.svg",
    name: "Cambridge",
    shortDescription:
      "Trusted learning resources that bring together local curriculum expertise and international best practice for homeschoolers.",
    heroTitle: "Cambridge",
    detailTitle: "Cambridge",
    description:
      "Cambridge supports homeschoolers with trusted, high-quality learning resources designed to make teaching and learning more effective, enjoyable and accessible. Their materials bring together local curriculum expertise and international best practice to provide relevant resources for learners across sub-Saharan Africa.",
    sections: [
      {
        heading: "International Learning Pathways",
        body:
          "Cambridge resources support families working with international education pathways, including IGCSE, AS Level, and A Level learning. Their digital tools and print materials help learners build subject knowledge and future-ready skills.",
      },
    ],
    moreInfo: [
      {
        label: "Website: cambridge.org/education",
        href: "https://www.cambridge.org/education",
      },
      {
        label: "Cambridge GO",
        href: "https://www.cambridge.org/go",
      },
    ],
    website: "https://www.cambridge.org/education",
  },
];

export function getPartnerBySlug(slug: string) {
  return partners.find((partner) => partner.slug === slug) ?? null;
}
