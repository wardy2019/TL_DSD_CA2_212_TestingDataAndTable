// Gamification System
class GameSystem {
  constructor() {
    this.xp = 0;
    this.level = 1;
    this.streak = 0;
    this.achievements = new Set();
    this.loadProgress();
  }

  addXP(amount, reason = '') {
    this.xp += amount;
    this.updateLevel();
    this.saveProgress();
    this.showXPGain(amount, reason);
    this.updateDisplay();
  }

  addStreak() {
    this.streak++;
    if (this.streak >= 3) {
      this.addXP(5, 'Streak Bonus!');
      document.body.classList.add('streak-effect');
      setTimeout(() => document.body.classList.remove('streak-effect'), 500);
    }
    this.saveProgress();
    this.updateDisplay();
  }

  resetStreak() {
    this.streak = 0;
    this.saveProgress();
    this.updateDisplay();
  }

  updateLevel() {
    const newLevel = Math.floor(this.xp / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.unlockAchievement('level_up', `Level ${this.level} Reached!`, `You've reached level ${this.level}!`);
    }
  }

  unlockAchievement(id, title, description) {
    if (!this.achievements.has(id)) {
      this.achievements.add(id);
      this.saveProgress();
      this.updateAchievements();
      this.showAchievementUnlock(title);
    }
  }

  showXPGain(amount, reason) {
    const xpGain = document.querySelector('.xp-gain');
    if (xpGain) {
      xpGain.textContent = `+${amount} XP ${reason}`;
      xpGain.classList.add('show');
      setTimeout(() => xpGain.classList.remove('show'), 2000);
    }
  }

  showAchievementUnlock(title) {
    // Create temporary achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-popup">
        <div class="achievement-popup-icon">🏆</div>
        <div class="achievement-popup-text">
          <div class="achievement-popup-title">Achievement Unlocked!</div>
          <div class="achievement-popup-desc">${title}</div>
        </div>
      </div>
    `;
    
    // Add styles for the notification
    const style = document.createElement('style');
    style.textContent = `
      .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        animation: slideIn 0.5s ease, slideOut 0.5s ease 2.5s;
      }
      .achievement-popup {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        min-width: 250px;
      }
      .achievement-popup-icon {
        font-size: 1.5rem;
        animation: bounce 0.6s ease;
      }
      .achievement-popup-title {
        font-weight: 700;
        font-size: 0.9rem;
      }
      .achievement-popup-desc {
        font-size: 0.8rem;
        opacity: 0.9;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }, 3000);
  }

  updateDisplay() {
    document.getElementById('total-xp').textContent = this.xp;
    document.getElementById('player-level').textContent = this.level;
    document.getElementById('streak-count').textContent = this.streak;
    
    const xpFill = document.getElementById('xp-fill');
    const progressInLevel = (this.xp % 100) / 100 * 100;
    xpFill.style.width = `${progressInLevel}%`;
  }

  updateAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    achievementsGrid.innerHTML = '';
    
    const allAchievements = [
      { id: 'first_correct', icon: '🎯', title: 'First Success', desc: 'Get your first answer correct' },
      { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: 'Get 3 answers correct in a row' },
      { id: 'level_1_complete', icon: '🏁', title: 'Detective', desc: 'Complete Level 1' },
      { id: 'perfect_level_1', icon: '💎', title: 'Perfect Detective', desc: 'Get 100% on Level 1' },
      { id: 'level_2_complete', icon: '🛠️', title: 'Architect', desc: 'Complete Level 2' },
      { id: 'comprehensive_test', icon: '📋', title: 'Comprehensive Tester', desc: 'Include all 4 test data types' },
      { id: 'level_3_complete', icon: '📝', title: 'Test Plan Master', desc: 'Complete Level 3' },
      { id: 'level_up', icon: '⭐', title: 'Level Up', desc: 'Reach a new level' },
      { id: 'certified_engineer', icon: '🎓', title: 'Certified Engineer', desc: 'Complete all levels with excellence' }
    ];
    
    allAchievements.forEach(achievement => {
      const div = document.createElement('div');
      div.className = `achievement ${this.achievements.has(achievement.id) ? 'unlocked' : ''}`;
      div.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">${achievement.title}</div>
          <p class="achievement-desc">${achievement.desc}</p>
        </div>
      `;
      achievementsGrid.appendChild(div);
    });
  }

  saveProgress() {
    const progress = {
      xp: this.xp,
      level: this.level,
      streak: this.streak,
      achievements: Array.from(this.achievements)
    };
    localStorage.setItem('testLabProgress', JSON.stringify(progress));
  }

  loadProgress() {
    const saved = localStorage.getItem('testLabProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      this.xp = progress.xp || 0;
      this.level = progress.level || 1;
      this.streak = progress.streak || 0;
      this.achievements = new Set(progress.achievements || []);
    }
  }
}

// Level 1 data set
const level1Questions = [
  {
    field: "Tree height",
    rule: "Tree height must be a whole number from 1 to 50 metres inclusive.",
    value: "1",
    type: "boundary"
  },
  {
    field: "Tree height",
    rule: "Tree height must be a whole number from 1 to 50 metres inclusive.",
    value: "50",
    type: "boundary"
  },
  {
    field: "Tree height",
    rule: "Tree height must be a whole number from 1 to 50 metres inclusive.",
    value: "25",
    type: "valid"
  },
  {
    field: "Tree height",
    rule: "Tree height must be a whole number from 1 to 50 metres inclusive.",
    value: "0",
    type: "invalid"
  },
  {
    field: "Tree height",
    rule: "Tree height must be a whole number from 1 to 50 metres inclusive.",
    value: "sixty",
    type: "erroneous"
  },
  {
    field: "Customer ID",
    rule: "Customer ID must be a six digit number.",
    value: "123456",
    type: "valid"
  },
  {
    field: "Customer ID",
    rule: "Customer ID must be a six digit number.",
    value: "12345",
    type: "invalid"
  },
  {
    field: "Customer ID",
    rule: "Customer ID must be a six digit number.",
    value: "1234567",
    type: "invalid"
  },
  {
    field: "Customer ID",
    rule: "Customer ID must be a six digit number.",
    value: "12A456",
    type: "erroneous"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "0",
    type: "boundary"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "20",
    type: "boundary"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "10",
    type: "valid"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "25",
    type: "invalid"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "-5",
    type: "invalid"
  },
  {
    field: "Jobs per month",
    rule: "Number of jobs must be a whole number from 0 to 20 inclusive.",
    value: "fifteen",
    type: "erroneous"
  }
];

let currentL1Index = 0;
let l1Score = 0;
let gameSystem;
let l1Questions = [];

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize game system
  gameSystem = new GameSystem();
  gameSystem.updateDisplay();
  gameSystem.updateAchievements();
  
  // Shuffle questions so each run feels different
  l1Questions = shuffle(level1Questions);
  const questions = l1Questions;
  const fieldElem = document.getElementById("l1-field");
  const ruleElem = document.getElementById("l1-rule");
  const dataElem = document.getElementById("l1-data");
  const feedbackElem = document.getElementById("l1-feedback");
  const progressElem = document.getElementById("l1-progress");
  const scoreFill = document.getElementById("l1-score-fill");
  const typeButtons = document.querySelectorAll(".type-btn");

  function renderQuestion() {
    const q = questions[currentL1Index];
    fieldElem.textContent = `Field: ${q.field}`;
    ruleElem.textContent = q.rule;
    dataElem.textContent = `Test data: "${q.value}"`;
    feedbackElem.textContent = "";
    feedbackElem.className = "feedback";
    const done = currentL1Index;
    progressElem.textContent = `Question ${done + 1} of ${questions.length} • Score: ${l1Score} • Streak: ${gameSystem.streak}`;
    const percent = (l1Score / questions.length) * 100;
    scoreFill.style.width = `${percent}%`;
  }

  function handleTypeClick(event) {
    const chosen = event.currentTarget.getAttribute("data-type");
    const q = questions[currentL1Index];
    if (!q) {
      return;
    }

    if (chosen === q.type) {
      l1Score += 1;
      gameSystem.addXP(10, 'Correct!');
      gameSystem.addStreak();
      
      // First correct answer achievement
      if (l1Score === 1) {
        gameSystem.unlockAchievement('first_correct', 'First Success', 'Got your first answer correct!');
      }
      
      // Streak achievements
      if (gameSystem.streak === 3) {
        gameSystem.unlockAchievement('streak_3', 'On Fire', 'Got 3 answers correct in a row!');
      }
      
      feedbackElem.textContent = `🎉 Correct! That is ${q.type} test data.`;
      feedbackElem.className = "feedback good";
    } else {
      gameSystem.resetStreak();
      feedbackElem.textContent = `❌ Not quite. That is actually ${q.type} test data.`;
      feedbackElem.className = "feedback bad";
    }

    // Move to next question after a short pause
    setTimeout(() => {
      currentL1Index += 1;
      if (currentL1Index >= questions.length) {
        const percent = (l1Score / questions.length) * 100;
        progressElem.textContent = `🏁 Level 1 Complete! Final score: ${l1Score} out of ${questions.length} (${Math.round(percent)}%)`;
        scoreFill.style.width = `${percent}%`;
        
        // Level completion achievements
        gameSystem.unlockAchievement('level_1_complete', 'Detective', 'Completed Level 1!');
        if (percent === 100) {
          gameSystem.addXP(25, 'Perfect Score!');
          gameSystem.unlockAchievement('perfect_level_1', 'Perfect Detective', 'Got 100% on Level 1!');
          feedbackElem.textContent = `🌟 PERFECT SCORE! You got every question right!`;
          feedbackElem.className = "feedback perfect";
        }
        
        // Add level complete effect
        document.getElementById('level1').classList.add('level-complete');
        
        updateOverallRating();
      } else {
        renderQuestion();
      }
    }, 1200);
  }

  typeButtons.forEach((btn) => {
    btn.addEventListener("click", handleTypeClick);
  });

  renderQuestion();

  // Level 2
  const l2CheckBtn = document.getElementById("l2-check");
  const l2Feedback = document.getElementById("l2-feedback");
  const l2Checklist = document.getElementById("l2-checklist");

  function isIntegerString(str) {
    if (str.trim() === "") {
      return false;
    }
    const num = Number(str);
    return Number.isInteger(num);
  }

  function classifyJobsValue(str) {
    // Returns what the value really is according to the rule
    if (!isIntegerString(str)) {
      return "erroneous";
    }
    const num = Number(str);
    if (num < 0 || num > 20) {
      return "invalid";
    }
    if (num === 0 || num === 20) {
      return "boundary";
    }
    return "valid";
  }

  l2CheckBtn.addEventListener("click", () => {
    const valueInputs = Array.from(document.querySelectorAll(".l2-value"));
    const typeSelects = Array.from(document.querySelectorAll(".l2-type"));

    const usedTypes = {
      valid: false,
      invalid: false,
      boundary: false,
      erroneous: false
    };

    let anyFilled = false;
    let correctMatches = 0;
    let totalUsed = 0;
    let mismatchMessages = [];

    valueInputs.forEach((input, index) => {
      const value = input.value.trim();
      const type = typeSelects[index].value;
      if (value === "" && type === "") {
        return;
      }
      anyFilled = true;
      totalUsed += 1;
      if (!type) {
        mismatchMessages.push(`Row ${index + 1}: choose a type for the test data.`);
        return;
      }
      const actual = classifyJobsValue(value);
      usedTypes[type] = true;
      if (actual === type || (actual === "boundary" && type === "valid")) {
        // Treat boundary labelled as valid as almost correct
        correctMatches += 1;
      } else {
        mismatchMessages.push(
          `Row ${index + 1}: you chose "${type}" but this behaves like "${actual}".`
        );
      }
    });

    l2Checklist.innerHTML = "";
    if (!anyFilled) {
      l2Feedback.textContent = "⚠️ Add at least one test value first.";
      l2Feedback.className = "feedback bad";
      return;
    }

    const listItems = [];

    // Coverage messages
    Object.entries(usedTypes).forEach(([type, used]) => {
      const li = document.createElement("li");
      li.textContent = used
        ? `✅ You included at least one ${type} test.`
        : `❌ You did not include any ${type} test.`;
      li.style.color = used ? "#15803d" : "#b91c1c";
      listItems.push(li);
    });

    mismatchMessages.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = `⚠️ ${msg}`;
      li.style.color = "#b91c1c";
      listItems.push(li);
    });

    listItems.forEach((li) => l2Checklist.appendChild(li));

    const scorePercent = Math.round((correctMatches / Math.max(totalUsed, 1)) * 100);
    const allTypesCovered = Object.values(usedTypes).every(Boolean);
    
    if (scorePercent === 100 && allTypesCovered) {
      gameSystem.addXP(50, 'Perfect Test Set!');
      gameSystem.unlockAchievement('comprehensive_test', 'Comprehensive Tester', 'Included all 4 test data types!');
      gameSystem.unlockAchievement('level_2_complete', 'Architect', 'Completed Level 2!');
      l2Feedback.textContent = "🌟 EXCELLENT! Perfect accuracy and complete coverage of all four test data types.";
      l2Feedback.className = "feedback perfect";
      document.getElementById('level2').classList.add('level-complete');
    } else if (scorePercent >= 80 && allTypesCovered) {
      gameSystem.addXP(35, 'Great Test Set!');
      gameSystem.unlockAchievement('comprehensive_test', 'Comprehensive Tester', 'Included all 4 test data types!');
      gameSystem.unlockAchievement('level_2_complete', 'Architect', 'Completed Level 2!');
      l2Feedback.textContent = "🎉 Great work! You covered all categories with good accuracy.";
      l2Feedback.className = "feedback good";
      document.getElementById('level2').classList.add('level-complete');
    } else if (scorePercent >= 60) {
      gameSystem.addXP(25, 'Good Progress!');
      if (allTypesCovered) {
        gameSystem.unlockAchievement('comprehensive_test', 'Comprehensive Tester', 'Included all 4 test data types!');
      }
      l2Feedback.textContent = "👍 Good start! Some improvements needed for accuracy or coverage.";
      l2Feedback.className = "feedback";
    } else {
      gameSystem.addXP(10, 'Keep Trying!');
      l2Feedback.textContent = "📚 Your test set needs work. Focus on covering all types and matching the validation rules for jobs per month.";
      l2Feedback.className = "feedback bad";
    }

    updateOverallRating();
  });

  // Level 3
  const l3CheckBtn = document.getElementById("l3-check");
  const l3Feedback = document.getElementById("l3-feedback");

  l3CheckBtn.addEventListener("click", () => {
    const idVal = document.getElementById("test-id").value.trim();
    const purposeVal = document.getElementById("test-purpose").value.trim();
    const dataVal = document.getElementById("test-data").value.trim();
    const expectedVal = document.getElementById("expected-result").value.trim();
    const actualVal = document.getElementById("actual-result").value.trim();

    let missing = [];
    if (!idVal) missing.push("Test ID");
    if (!purposeVal) missing.push("Purpose");
    if (!dataVal) missing.push("Test data");
    if (!expectedVal) missing.push("Expected result");
    if (!actualVal) missing.push("Actual result");

    if (missing.length === 0) {
      // Check quality of entries
      let qualityScore = 0;
      if (purposeVal.length > 20) qualityScore++;
      if (dataVal.includes('=') || dataVal.includes(':')) qualityScore++;
      if (expectedVal.length > 15) qualityScore++;
      if (actualVal.toLowerCase().includes('not run') || actualVal.length > 10) qualityScore++;
      
      if (qualityScore >= 3) {
        gameSystem.addXP(75, 'Excellent Test Plan!');
        gameSystem.unlockAchievement('level_3_complete', 'Test Plan Master', 'Completed Level 3!');
        l3Feedback.textContent = "🌟 OUTSTANDING! Professional-quality test plan with comprehensive details.";
        l3Feedback.className = "feedback perfect";
        document.getElementById('level3').classList.add('level-complete');
      } else {
        gameSystem.addXP(50, 'Good Test Plan!');
        gameSystem.unlockAchievement('level_3_complete', 'Test Plan Master', 'Completed Level 3!');
        l3Feedback.textContent = "✅ Good test plan! All sections completed with adequate detail.";
        l3Feedback.className = "feedback good";
        document.getElementById('level3').classList.add('level-complete');
      }
    } else {
      l3Feedback.textContent = `📝 Test plan incomplete. Please add details for: ${missing.join(", ")}.`;
      l3Feedback.className = "feedback bad";
    }

    updateOverallRating();
  });

  // Overall rating
  const ratingElem = document.getElementById("overall-rating");

  function updateOverallRating() {
    const percentLevel1 = (l1Score / level1Questions.length) * 100;

    // Check completion status
    const l1Complete = currentL1Index >= level1Questions.length;
    const l2FeedbackText = document.getElementById("l2-feedback").textContent || "";
    const l2Complete = l2FeedbackText.includes("EXCELLENT") || l2FeedbackText.includes("Great work");
    const l3FeedbackText = document.getElementById("l3-feedback").textContent || "";
    const l3Complete = l3FeedbackText.includes("OUTSTANDING") || l3FeedbackText.includes("Good test plan");

    let stars = 0;
    if (percentLevel1 >= 60) stars += 1;
    if (l2Complete) stars += 1;
    if (l3Complete) stars += 1;

    const certificationBadge = document.getElementById('certification-badge');
    
    if (stars === 3 && percentLevel1 >= 80) {
      gameSystem.addXP(100, 'Certification Earned!');
      gameSystem.unlockAchievement('certified_engineer', 'Certified Engineer', 'Completed all levels with excellence!');
      ratingElem.innerHTML = `
        <div class="rating-stars">⭐⭐⭐</div>
        <p><strong>🎓 CERTIFICATION EARNED!</strong></p>
        <p>Outstanding performance across all levels. You've mastered test data classification, 
        comprehensive test set design, and professional test planning. You're ready for 
        real-world software testing!</p>
      `;
      certificationBadge.classList.remove('hidden');
    } else if (stars === 3) {
      ratingElem.innerHTML = `
        <div class="rating-stars">⭐⭐⭐</div>
        <p><strong>🏆 EXPERT LEVEL!</strong></p>
        <p>Excellent work! You've completed all levels successfully. You have a solid 
        understanding of test data types and test planning principles.</p>
      `;
    } else if (stars === 2) {
      ratingElem.innerHTML = `
        <div class="rating-stars">⭐⭐</div>
        <p><strong>🎯 PROFICIENT!</strong></p>
        <p>Good progress! You're developing strong testing skills. Complete the remaining 
        level(s) to achieve expert status.</p>
      `;
    } else if (stars === 1) {
      ratingElem.innerHTML = `
        <div class="rating-stars">⭐</div>
        <p><strong>📚 LEARNING!</strong></p>
        <p>You're on the right track! Keep practicing with test data types and 
        work on building comprehensive test sets.</p>
      `;
    } else {
      ratingElem.innerHTML = `
        <div class="rating-stars">☆☆☆</div>
        <p><strong>🚀 GET STARTED!</strong></p>
        <p>Begin your testing journey! Work through each level to build your 
        understanding of test data and test planning.</p>
      `;
    }
    
    // Add CSS for rating stars
    if (!document.getElementById('rating-styles')) {
      const style = document.createElement('style');
      style.id = 'rating-styles';
      style.textContent = `
        .rating-stars {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Python hint
  const pythonBtn = document.getElementById("show-python-hint");
  const pythonBlock = document.getElementById("python-hint");

  pythonBtn.addEventListener("click", () => {
    if (pythonBlock.style.display === "block") {
      pythonBlock.style.display = "none";
      pythonBtn.textContent = "🐍 Show Python Implementation";
      return;
    }

    pythonBlock.textContent = [
      "# 🌳 Shropshire Arbor Services Job Validation System",
      "# This code demonstrates how your test planning translates to real Python!",
      "",
      "def validate_jobs_per_month(jobs):",
      "    \"\"\"Validate number of jobs per month (0-20 inclusive)\"\"\"",
      "    # Handle erroneous data (wrong type)",
      "    if not isinstance(jobs, int):",
      "        return False, 'Error: Must be a whole number'",
      "    ",
      "    # Handle invalid data (out of range)",
      "    if jobs < 0:",
      "        return False, 'Error: Cannot be negative'",
      "    if jobs > 20:",
      "        return False, 'Error: Maximum 20 jobs per month allowed'",
      "    ",
      "    # Valid data (including boundary values 0 and 20)",
      "    return True, f'Success: {jobs} jobs scheduled for month'",
      "",
      "# 🌳 Test Cases Based on Your Test Plan",
      "test_cases = [",
      "    # Boundary tests",
      "    {'id': 'TC-JOBS-01', 'input': 0, 'type': 'boundary'},",
      "    {'id': 'TC-JOBS-02', 'input': 20, 'type': 'boundary'},",
      "    # Valid tests",
      "    {'id': 'TC-JOBS-03', 'input': 10, 'type': 'valid'},",
      "    # Invalid tests",
      "    {'id': 'TC-JOBS-04', 'input': -5, 'type': 'invalid'},",
      "    {'id': 'TC-JOBS-05', 'input': 25, 'type': 'invalid'},",
      "    # Erroneous tests",
      "    {'id': 'TC-JOBS-06', 'input': 'fifteen', 'type': 'erroneous'},",
      "]",
      "",
      "# 🚀 Run the tests",
      "print('🌳 Running Shropshire Arbor Services Test Suite...')",
      "for case in test_cases:",
      "    is_valid, message = validate_jobs_per_month(case['input'])",
      "    status = '✅ PASS' if (case['type'] in ['valid', 'boundary'] and is_valid) or (case['type'] in ['invalid', 'erroneous'] and not is_valid) else '❌ FAIL'",
      "    print(f\"{case['id']} ({case['type']}): {status} - {message}\")",
      "",
      "# 🎯 This is exactly what professional testers do!"
    ].join("\n");

    pythonBlock.style.display = "block";
    pythonBtn.textContent = "🐍 Hide Python Implementation";
  });
});
