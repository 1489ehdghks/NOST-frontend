import React, { useRef, useState, useEffect, useCallback } from 'react';
import SideLayout from '../../widgets/layout/sideLayout/SideLayout';
import SynopsysGenerator from './component/SynopsysGenerator';
import SummaryGenerator from './component/SummaryGenerator';
import SynopsysResult from './component/SynopsysResult';
import './CreatePage.scss';

const CreatePage = () => {
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 4;


  const scrollToSection = useCallback((sectionIndex) => {
    const sections = containerRef.current.querySelectorAll('.section');
    if (sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navigateToNext = useCallback(() => {
    if (currentSection < totalSections - 1) {
      setCurrentSection((prev) => {
        const newSection = prev + 1;
        scrollToSection(newSection);
        return newSection;
      });
    }
  }, [currentSection, scrollToSection, totalSections]);

  const navigateToPrev = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(prev => {
        const newSection = prev - 1;
        scrollToSection(newSection);
        return newSection;
      });
    }
  }, [currentSection, scrollToSection]);

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      const delta = event.deltaY;
      if (delta > 0) {
        navigateToNext();
      } else {
        navigateToPrev();
      }
    };

    const container = containerRef.current;
    container.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleScroll);
    };
  }, [navigateToNext, navigateToPrev]);

  return (
    <div className="scroll-container" ref={containerRef}>
      <SideLayout>
        <div className="section" id="section1">
          <SynopsysGenerator onComplete={navigateToNext} />
        </div>
        <div className="section" id="section2">
          <SynopsysResult onComplete={navigateToNext} />
        </div>
        <div className="section" id="section3">
          <SummaryGenerator />
        </div>
      </SideLayout>
    </div>
  );
};
export default CreatePage;
