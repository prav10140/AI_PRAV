// Firebase Configuration - Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyAXLFrgXRvgyAjXWI0e9eiCAtEw50xSLHs",
  authDomain: "loginform-5eb02.firebaseapp.com",
  projectId: "loginform-5eb02",
  storageBucket: "loginform-5eb02.firebasestorage.app",  // ✅ Corrected
  messagingSenderId: "499608178000",
  appId: "1:499608178000:web:21ffbf36c22deb45f53055",
  databaseURL: "https://loginform-5eb02-default-rtdb.firebaseio.com/"
}




// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Global variables
let currentUser = null;
let isLogin = true;

// Comprehensive Educational Knowledge Base
async function getWolframAnswer(question) {
  try {
    const res = await fetch(`https://my-app-two-flame-49.vercel.app/api/wolfram?query=${encodeURIComponent(question)}`);
    if (!res.ok) throw new Error("Proxy API request failed");

    const data = await res.json();
    if (!data.queryresult?.success) {
      return null;
    }

    const pods = data.queryresult.pods;

    // Find the first subpod with a plaintext and image
    for (const pod of pods) {
      for (const sub of pod.subpods) {
        if (sub.plaintext && sub.img?.src) {
          return {
            title: pod.title,
            answer: sub.plaintext.trim(),
            image: sub.img.src
          };
        }
      }
    }

    // Fallback if no image
    return null;

  } catch (error) {
    return null;
  }
}
async function getAIResponse(question) {
  try {
    const response = await fetch(`/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "Sorry, I couldn't get an answer right now.";
  }
}


// Utility Functions
const showElement = (id) => {
    document.getElementById(id).style.display = 'block';
};

const hideElement = (id) => {
    document.getElementById(id).style.display = 'none';
};

const showError = (message) => {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
};

const hideError = () => {
    document.getElementById('error-message').style.display = 'none';
};

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatLastActive = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
};

const getTrophyIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
};

const getRankClass = (index) => {
    if (index === 0) return "rank-gold";
    if (index === 1) return "rank-silver";
    if (index === 2) return "rank-bronze";
    return "rank-default";
};

// Authentication Functions
const switchToLogin = () => {
    isLogin = true;
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('password').placeholder = 'Enter your password';
    document.getElementById('auth-button-text').textContent = 'Sign In';
    document.querySelector('#auth-submit i').className = 'fas fa-sign-in-alt mr-2';
    hideError();
};

const switchToRegister = () => {
    isLogin = false;
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('password').placeholder = 'Create a password';
    document.getElementById('auth-button-text').textContent = 'Create Account';
    document.querySelector('#auth-submit i').className = 'fas fa-user-plus mr-2';
    hideError();
};

const handleAuth = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('auth-submit');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${isLogin ? 'Signing in...' : 'Creating account...'}`;
    hideError();

    try {
        if (isLogin) {
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Initialize user stats in database
            await database.ref(`users/${user.uid}`).set({
                email: user.email,
                questionsAsked: 0,
                lastActive: Date.now(),
            });
        }
    } catch (error) {
        showError(error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2"></i>${isLogin ? 'Sign In' : 'Create Account'}`;
    }
};

const logout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

// Dashboard Functions
const switchTab = (tabName) => {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.question-section, .history-section, .leaderboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tabName}-section`).classList.add('active');
};

const submitQuestion = async (e) => {
    e.preventDefault();
    
    const questionInput = document.getElementById('question-input');
    const question = questionInput.value.trim();
    const submitBtn = document.getElementById('submit-question');
    
    if (!question || !currentUser) return;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Answer...';
    
    try {
        // Get AI response
        const answer = await getAIResponse(question);
        
        // Save to Firebase
        const questionRef = database.ref('questions').push();
        await questionRef.set({
            question: question,
            answer: answer,
            timestamp: Date.now(),
            userId: currentUser.uid,
            userEmail: currentUser.email,
        });
        
        // Update user stats
        const userRef = database.ref(`users/${currentUser.uid}`);
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val() || {};
        const currentQuestions = userData.questionsAsked || 0;
        
        await userRef.update({
            lastActive: Date.now(),
            questionsAsked: currentQuestions + 1,
        });
        
        questionInput.value = '';
        loadQuestionHistory();
        loadLeaderboard();
        
    } catch (error) {
        console.error('Error submitting question:', error);
        alert('Failed to submit question. Please try again.');
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Question';
};

const loadQuestionHistory = () => {
    if (!currentUser) return;
    
    const questionsRef = database.ref('questions');
    questionsRef.orderByChild('userId').equalTo(currentUser.uid).on('value', (snapshot) => {
        const data = snapshot.val();
        const questionsList = document.getElementById('questions-list');
        const questionCount = document.getElementById('question-count');
        
        if (data) {
            const questions = Object.entries(data).map(([id, question]) => ({
                id,
                ...question,
            }));
            
            // Sort by timestamp descending (newest first)
            questions.sort((a, b) => b.timestamp - a.timestamp);
            
            questionCount.textContent = questions.length;
            
            questionsList.innerHTML = questions.map(q => `
                <div class="question-item">
                    <div class="question-content">
                        <div class="question-text">
                            <strong>Q:</strong> ${q.question}
                        </div>
                        <div class="answer-text">
                            <strong>A:</strong> ${q.answer}
                        </div>
                    </div>
                    <div class="question-meta">
                        <i class="fas fa-clock"></i>
                        <span>${formatDate(q.timestamp)}</span>
                    </div>
                </div>
            `).join('');
        } else {
            questionCount.textContent = '0';
            questionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>No questions asked yet.</p>
                    <small>Start by asking your first question!</small>
                </div>
            `;
        }
    });
};

const loadLeaderboard = () => {
    const usersRef = database.ref('users');
    usersRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const usersList = document.getElementById('users-list');
        const totalUsers = document.getElementById('total-users');
        
        if (data) {
            const users = Object.entries(data).map(([id, user]) => ({
                id,
                ...user,
            }));
            
            // Sort by questions asked (descending) and then by last active
            users.sort((a, b) => {
                if (b.questionsAsked !== a.questionsAsked) {
                    return b.questionsAsked - a.questionsAsked;
                }
                return b.lastActive - a.lastActive;
            });
            
            const topUsers = users.slice(0, 10); // Top 10 users
            totalUsers.textContent = users.length;
            
            usersList.innerHTML = topUsers.map((user, index) => `
                <div class="user-item ${getRankClass(index)}">
                    <div class="user-rank">
                        <span class="rank-icon">${getTrophyIcon(index)}</span>
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user.email?.split('@')[0] || 'Anonymous'}</div>
                        <div class="user-activity">
                            <i class="fas fa-clock"></i>
                            <span>${formatLastActive(user.lastActive)}</span>
                        </div>
                    </div>
                    <div class="user-stats">
                        <span class="questions-badge">${user.questionsAsked || 0} questions</span>
                    </div>
                </div>
            `).join('');
        } else {
            totalUsers.textContent = '0';
            usersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>No active users yet.</p>
                </div>
            `;
        }
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Auth tab switching
    document.getElementById('login-tab').addEventListener('click', switchToLogin);
    document.getElementById('register-tab').addEventListener('click', switchToRegister);
    
    // Auth form submission
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Question form submission
    document.getElementById('question-form').addEventListener('submit', submitQuestion);
    
    // Mobile navigation
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Firebase auth state listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            document.getElementById('user-email').textContent = user.email;
            hideElement('loading-screen');
            hideElement('auth-container');
            showElement('dashboard');
            loadQuestionHistory();
            loadLeaderboard();
        } else {
            currentUser = null;
            hideElement('loading-screen');
            hideElement('dashboard');
            showElement('auth-container');
        }
    });
    
    // Initial load
    setTimeout(() => {
        hideElement('loading-screen');
        if (!currentUser) {
            showElement('auth-container');
        }
    }, 2000);
});
