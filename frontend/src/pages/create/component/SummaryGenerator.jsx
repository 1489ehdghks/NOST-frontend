import React, { useState } from 'react';
import './SummaryGenerator.scss';
import useThemeStore from '../../../shared/store/Themestore';
import useBookStore from '../../../shared/store/BookStore';
import { deletePrologue, generatePrologue, generateSummary } from '../../../features/novel/SummaryInstance'; // 수정된 부분
import useGlobalStore from '../../../shared/store/GlobalStore';
import Prologue from './summaryGeneratorComponent/Prologue';
import Summary from './summaryGeneratorComponent/Summary';

const SummaryGenerator = () => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];
    const { prologue, chapterNum, translatedPrologue, translatedContent, summary, bookId, language, recommendations, setBookId, setChapterNum, setPrologue, setSummary, setTranslatedPrologue, setTranslatedContent, setRecommendations } = useBookStore();
    const [userText, setUserText] = useState('');
    const { isLoading, setIsLoading, error, setError } = useGlobalStore();

    const handleRetryClick = async () => {
        triggerAnimation();
        setIsLoading(true);
        const prompt = `Please write a prologue that matches the content..${prologue}`;

        try {
            const deleteResponse = await deletePrologue(bookId);
            if (!deleteResponse.success) throw new Error('Failed to delete prologue');

            const response = await generatePrologue(bookId, prompt, language.value);
            if (!response.success) throw new Error('Failed to generate prologue');

            const { data } = response;
            setPrologue(data.prologue);
            setTranslatedPrologue(data.translated_content);
        } catch (error) {
            setError(error);
            console.error("Error submitting data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextClick = async () => {
        triggerAnimation();
        setIsLoading(true);
        const prompt = `Please write a scean that matches the content.${prologue}`;
        try {
            const response = await generateSummary(bookId, prompt, language.value);
            if (!response.success) throw new Error('Failed to generate summary');

            const { data } = response;
            setPrologue(data.prologue);
            setChapterNum(data.chapter_num);
            setTranslatedContent(data.translated_content);
            setBookId(data.book_id);
            setRecommendations(data.recommendations);
        } catch (error) {
            setError(error);
            console.error("Error submitting data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecommendationClick = async (description) => {
        triggerAnimation();
        setIsLoading(true);
        const prompt = `Please write a scean that matches the content.${description}`;
        try {
            const response = await generateSummary(bookId, prompt, language.value);
            if (!response.success) throw new Error('Failed to generate summary');

            const { data } = response;
            setSummary(data.final_summary);
            setTranslatedContent(data.translated_content);
            setBookId(data.book_id);
            setChapterNum(data.chapter_num);
            setRecommendations(data.recommendations);
        } catch (err) {
            setError(err);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserTextSubmit = async () => {
        triggerAnimation();
        setIsLoading(true);
        try {
            const response = await generateSummary(bookId, userText, language.value);
            if (!response.success) throw new Error('Failed to generate summary');

            const { data } = response;
            setSummary(data.final_summary);
            setTranslatedContent(data.translated_content);
            setBookId(data.book_id);
            setChapterNum(data.chapter_num);
            setRecommendations(data.recommendations);
        } catch (err) {
            setError(err);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerAnimation = () => {
        const book = document.querySelector('.SummaryGenerator-book');
        if (book) {
            book.classList.add('animate');
            setTimeout(() => {
                book.classList.remove('animate');
            }, 5000);
        }
    };

    return (
        <div className="novel-continuation" style={{ backgroundColor: currentTheme.mainpageBackgroundColor, color: currentTheme.textColor }}>
            {chapterNum === 0 ? (
                <div className="SummaryGenerator-fullpage">
                    <Prologue
                        prologue={prologue}
                        translatedPrologue={translatedPrologue}
                        setTranslatedPrologue={setTranslatedPrologue}
                        handleRetryClick={handleRetryClick}
                        handleNextClick={handleNextClick}
                    />
                </div>
            ) : (
                <div className="SummaryGenerator-book">
                    <div className="SummaryGenerator-page left-page">
                        <textarea
                            value={translatedContent || ''}
                            readOnly
                            className="summary-textarea"
                        />
                    </div>
                    <div className="SummaryGenerator-page right-page">
                        <Summary
                            recommendations={recommendations}
                            handleRecommendationClick={handleRecommendationClick}
                            userText={userText}
                            setUserText={setUserText}
                            handleUserTextSubmit={handleUserTextSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryGenerator;
