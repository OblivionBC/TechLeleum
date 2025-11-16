"use client";

import "./lessons.css";
import LessonMap from "./lessonMap";

export default function Lessons() {
    return (
        <div className="lesson-page">

            {/* Header Section */}
            <header className="lesson-header">
                <h1>Your Coding Adventure! 🚀</h1>
                <p>
                    Start your culturally contextualized coding journey with fun lessons that mix traditional
                    stories with modern programming! ✨
                </p>
            </header>

            {/* Top Cards Container */}
            <div className="top-cards">

                {/* Progress Card */}
                <div className="progress-card">
                    <div className="progress-value">0%</div>
                    <div className="progress-text">
                        <h3>Your Progress</h3>
                        <p>0 of 8 topics completed! 🌟</p>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                </div>

                {/* Reminder Card */}
                <div className="reminder-card">
                    <h3>Keep Learning!</h3>
                    <p>Unlock badges & achievements 🍎</p>
                </div>

            </div>

            {/* lessons Graph */}
            <LessonMap />



            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Indigenous Youth Code. All rights reserved.</p>
                <p>Built with respect for Coast Salish traditions and territories.</p>
            </footer>

        </div>
    );
}
