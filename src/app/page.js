'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Code, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Moderna platforma za elektronsku trgovinu sa punim funkcionalnostima',
      tags: ['Next.js', 'React', 'Stripe', 'Database'],
      link: '#',
    },
    {
      title: 'Task Management App',
      description: 'Aplikacija za upravljanje projektima i zadacima u realnom vremenu',
      tags: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
      link: '#',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Napredna kontrolna tabla za analizu podataka i izveštaje',
      tags: ['Next.js', 'Chart.js', 'API', 'PostgreSQL'],
      link: '#',
    },
    {
      title: 'Social Network',
      description: 'Društvena mreža sa pratnjom, komentarima i notifikacijama',
      tags: ['React', 'Firebase', 'Realtime DB', 'Cloud Storage'],
      link: '#',
    },
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API'] },
    { category: 'Tools', items: ['Git', 'Docker', 'Vercel', 'VS Code', 'Figma'] },
  ];

  return (
    <div className="bg-primary min-h-screen">
      {/* Navigation */}
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-secondary/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div className="text-2xl font-bold text-accent" whileHover={{ scale: 1.1 }}>
            Maksim
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {['Početna', 'Projekti', 'Veštine', 'Kontakt'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-accent transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-secondary/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="px-4 py-4 space-y-4">
              {['Početna', 'Projekti', 'Veštine', 'Kontakt'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="početna"
        className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="text-center max-w-4xl">
          <motion.div variants={fadeInUp}>
            <div className="inline-block mb-6 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <span className="text-accent text-sm font-semibold">👋 Dobrodošli na moj portfolio</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent to-blue-300 bg-clip-text text-transparent"
          >
            Maksim Vojvodić
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-400 mb-8"
          >
            Profesionalni razvojni inženjer sa strašću za kreiranje modernih web aplikacija
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Pogledaj Moje Radove
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
            >
              Preuzmi CV
            </motion.button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center gap-6">
            {[
              { icon: Github, link: '#' },
              { icon: Linkedin, link: '#' },
              { icon: Mail, link: '#' },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.link}
                className="p-3 bg-secondary hover:bg-accent/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <social.icon size={20} className="text-accent" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mb-12 text-center text-accent"
          >
            Moje Specijalizacije
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: 'Čist Kod',
                description: 'Profesionalan, održavan i skalabilan kod sa najbolje prakse',
              },
              {
                icon: Zap,
                title: 'Brz i Efikasan',
                description: 'Optimizovan performanse i brza učitavanja za savršeno iskustvo',
              },
              {
                icon: Target,
                title: 'Fokusiran na Cilj',
                description: 'Svaki projekat je izrađen sa jasnim ciljevima i zahtjevima',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 bg-primary border border-accent/20 rounded-lg hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10"
                whileHover={{ y: -10 }}
              >
                <feature.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projekti"
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mb-12 text-center text-accent"
          >
            Moji Projekti
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group bg-secondary/50 border border-accent/20 rounded-lg overflow-hidden hover:border-accent/50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.a
                    href={project.link}
                    className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    Pogledaj Više <ExternalLink size={16} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        id="veštine"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mb-12 text-center text-accent"
          >
            Tehničke Veštine
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skillGroup, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-4 text-accent">{skillGroup.category}</h3>
                <div className="space-y-3">
                  {skillGroup.items.map((skill, i) => (
                    <motion.div
                      key={i}
                      className="p-3 bg-primary border border-accent/20 rounded-lg hover:border-accent/50 transition-all"
                      whileHover={{ x: 5, borderColor: '#3B82F6' }}
                    >
                      <p className="text-gray-300">{skill}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="kontakt"
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mb-6 text-accent"
          >
            Hajde da Radimo Zajedno
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-gray-400 mb-8 text-lg">
            Zainteresovan si za projekat? Slobodno me kontaktiraj putem email-a ili društvenih mreža.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="mailto:kontakt@maksaza-sajt.com"
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} /> Pošalji Email
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="border-t border-accent/20 bg-secondary/50 py-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Maksim Vojvodić. Sva prava zadržana.</p>
          <p className="text-sm mt-2">Napravljen sa ❤️ pomoću Next.js, React i Tailwind CSS</p>
        </div>
      </motion.footer>
    </div>
  );
}