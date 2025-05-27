
const firebaseConfig = {
  apiKey: "AIzaSyAXLFrgXRvgyAjXWI0e9eiCAtEw50xSLHs",
  authDomain: "loginform-5eb02.firebaseapp.com",
  projectId: "loginform-5eb02",
  storageBucket: "loginform-5eb02.firebasestorage.app",
  messagingSenderId: "499608178000",
  appId: "1:499608178000:web:21ffbf36c22deb45f53055",
  databaseURL: "https://loginform-5eb02-default-rtdb.firebaseio.com/",
}
const firebase = window.firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const database = firebase.database()

let currentUser = null
let isLogin = true

// Knowledge Base
const getEducationalResponse = (question) => {
  const lowerQuestion = question.toLowerCase()

  // Mathematics
  if (lowerQuestion.includes("algebra")) {
    return "Algebra is about finding unknown values using equations. Key tips: 1) Always do the same operation to both sides of an equation. 2) Isolate the variable step by step. 3) Check your answer by substituting back. 4) Remember PEMDAS for order of operations. Practice with simple equations first, then gradually increase complexity."
  }

  if (lowerQuestion.includes("geometry")) {
    return "Geometry deals with shapes, sizes, and spatial relationships. Remember: 1) Draw diagrams to visualize problems. 2) Learn key formulas for area, perimeter, and volume. 3) Understand angle relationships (complementary = 90°, supplementary = 180°). 4) Use the Pythagorean theorem for right triangles (a² + b² = c²)."
  }

  if (lowerQuestion.includes("calculus")) {
    return "Calculus studies rates of change (derivatives) and accumulation (integrals). Key concepts: 1) Limits describe behavior as values approach a point. 2) Derivatives find slopes and rates of change. 3) Integrals find areas under curves. 4) Practice with basic functions first (polynomials, trig functions)."
  }

  // Sciences
  if (lowerQuestion.includes("photosynthesis")) {
    return "Photosynthesis is how plants make food using sunlight. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process occurs in chloroplasts and has two stages: light reactions (in thylakoids) and the Calvin cycle (in stroma). It's essential for life on Earth as it produces oxygen and glucose."
  }

  if (lowerQuestion.includes("newton") && lowerQuestion.includes("law")) {
    return "Newton's Three Laws of Motion: 1) First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. 2) Second Law: Force = mass × acceleration (F=ma). 3) Third Law: For every action, there's an equal and opposite reaction. These laws explain all motion and are fundamental to physics."
  }

  if (lowerQuestion.includes("periodic table")) {
    return "The periodic table organizes elements by atomic number (number of protons). Key patterns: 1) Elements in the same column (group) have similar properties. 2) Atomic size decreases from left to right across a period. 3) Metals are on the left, nonmetals on the right, metalloids in between. 4) The table helps predict element behavior and chemical bonding."
  }

  // History
  if (lowerQuestion.includes("world war")) {
    return "World Wars were global conflicts that reshaped the 20th century. WWI (1914-1918) was caused by imperialism, alliances, militarism, and nationalism. WWII (1939-1945) involved fascism vs. democracy and the Allies vs. Axis powers. Both wars led to major political, social, and technological changes. Study the causes, major battles, key figures, and long-term consequences."
  }

  if (lowerQuestion.includes("american revolution")) {
    return "The American Revolution (1775-1783) was fought for independence from British rule. Key causes: taxation without representation, restrictive laws like the Stamp Act. Important events: Boston Tea Party (1773), Declaration of Independence (1776), Valley Forge winter. Key figures: George Washington, Benjamin Franklin, Thomas Jefferson. Result: United States became an independent nation with a new democratic government."
  }

  // Literature and English
  if (lowerQuestion.includes("shakespeare")) {
    return "William Shakespeare (1564-1616) wrote plays and sonnets that explore universal themes like love, power, betrayal, and human nature. Key works: Hamlet (revenge tragedy), Romeo and Juliet (tragic love), Macbeth (ambition and guilt). Tips for reading: understand the historical context, look up unfamiliar words, focus on character motivations, and remember that many phrases we use today come from Shakespeare."
  }

  if (lowerQuestion.includes("essay writing")) {
    return "Good essay structure: 1) Introduction with hook, background, and clear thesis statement. 2) Body paragraphs with topic sentences, evidence, and analysis. 3) Conclusion that reinforces your argument without just repeating. Tips: Plan before writing, use transitions between paragraphs, cite sources properly, vary sentence structure, and always revise for clarity and grammar."
  }

  // Study Skills
  if (lowerQuestion.includes("time management")) {
    return "Effective time management strategies: 1) Use a planner or digital calendar. 2) Prioritize tasks by importance and deadline (urgent vs. important matrix). 3) Break large projects into smaller, manageable tasks. 4) Eliminate distractions during focused study time. 5) Use the Pomodoro Technique (25 min work, 5 min break). 6) Set realistic goals and deadlines."
  }

  if (lowerQuestion.includes("note taking")) {
    return "Effective note-taking methods: 1) Cornell Notes: divide page into notes, cues, and summary sections. 2) Mind mapping for visual learners and brainstorming. 3) Outline method for hierarchically organized information. 4) Write in your own words to ensure understanding. 5) Review and revise notes within 24 hours. 6) Use abbreviations and symbols for speed."
  }

  if (lowerQuestion.includes("test anxiety")) {
    return "Managing test anxiety: 1) Prepare thoroughly - confidence reduces anxiety. 2) Practice relaxation techniques like deep breathing or progressive muscle relaxation. 3) Get adequate sleep before the test. 4) Arrive early and bring all necessary materials. 5) Read all instructions carefully. 6) Start with easier questions to build confidence. 7) If you feel overwhelmed, take a moment to breathe and refocus."
  }

  // Programming and Computer Science
  if (lowerQuestion.includes("python")) {
    return "Python is a beginner-friendly programming language. Key concepts: 1) Variables store data (numbers, strings, lists). 2) Functions perform specific tasks and can be reused. 3) Loops (for, while) repeat actions. 4) Conditionals (if, elif, else) make decisions. 5) Lists and dictionaries store collections of data. Start with simple programs like calculators, then move to more complex projects. Practice coding daily!"
  }

  if (lowerQuestion.includes("algorithm")) {
    return "An algorithm is a step-by-step procedure to solve a problem. Good algorithms are: 1) Clear and unambiguous in their steps. 2) Efficient in time and space complexity. 3) Correct for all valid inputs. 4) Finite (they must eventually stop). Common algorithm types: sorting (bubble, merge, quick), searching (linear, binary), graph traversal (BFS, DFS). Practice by solving problems on coding platforms."
  }

  // General Study Tips
  if (lowerQuestion.includes("motivation") || lowerQuestion.includes("procrastination")) {
    return "Staying motivated and beating procrastination: 1) Set specific, achievable goals with deadlines. 2) Break large tasks into smaller, less overwhelming pieces. 3) Reward yourself for completing tasks. 4) Find a study buddy or group for accountability. 5) Connect learning to your interests and future goals. 6) Take regular breaks to avoid burnout. 7) Remember that struggle is part of learning - don't give up!"
  }

  if (lowerQuestion.includes("memory") || lowerQuestion.includes("remember")) {
    return "Memory improvement techniques: 1) Spaced repetition - review material at increasing intervals. 2) Active recall - test yourself instead of just re-reading. 3) Create associations and mnemonics. 4) Use the method of loci (memory palace). 5) Teach the material to someone else. 6) Get adequate sleep - memory consolidation happens during sleep. 7) Exercise regularly to improve brain function."
  }

  // Default comprehensive response
  return `Thanks for your beautiful confusion "${question}". Here's some educational guidance:

📚 **Study Strategies:**
• Break complex topics into smaller, manageable parts
• Use active learning: summarize, teach others, create examples
• Connect new information to what you already know
• Practice regularly rather than cramming before tests
• Use multiple resources: textbooks, videos, practice problems

🧠 **Learning Tips:**
• Take notes in your own words to ensure understanding
• Create visual aids like diagrams, charts, or mind maps
• Form study groups to discuss and explain concepts
• Ask questions when you don't understand something
• Review material regularly to reinforce long-term memory

💡 **Problem-Solving Approach:**
1. Read the question carefully and understand what's being asked
2. Identify what information you have and what you need to find
3. Determine what methods, formulas, or concepts apply
4. Work through the solution step by step
5. Check your answer for reasonableness and accuracy
6. Reflect on the process to improve future problem-solving

🎯 **Subject-Specific Tips:**
• **Math**: Practice problems daily, show all work, check answers
• **Science**: Understand concepts before memorizing facts, do experiments
• **History**: Create timelines, understand cause and effect
• **Literature**: Read actively, analyze themes and characters
• **Languages**: Practice speaking, immerse yourself in the language

Remember: Learning is a process that takes time and practice. Don't be discouraged by initial difficulties - they're a normal and important part of developing understanding. Every expert was once a beginner!`
}

const isMathExpression = (text) => /^[0-9\s+\-*/().^]+$/.test(text.trim())

async function getWolframAnswer(question) {
  try {
    const res = await fetch(`https://my-app-two-flame-49.vercel.app/api/wolfram?query=${encodeURIComponent(question)}`)
    if (!res.ok) throw new Error("Proxy API request failed")

    const data = await res.json()
    if (!data.queryresult?.success) {
      return null
    }

    const pods = data.queryresult.pods

    const detailedPods = pods.filter(
      (pod) => pod.subpods && pod.subpods.some((sub) => (sub.plaintext && sub.plaintext.trim() !== "") || sub.img?.src),
    )

    if (detailedPods.length === 0) return null

    let formattedAnswer = ""

    detailedPods.forEach((pod) => {
      const allTexts = pod.subpods
        .map((sub) => (sub.plaintext ? sub.plaintext.trim() : ""))
        .filter((text) => text !== "")
        .join("<br>")

      const allImages = pod.subpods.map((sub) => sub.img?.src).filter((src) => src)

      formattedAnswer += `
        <div class="pod-section">
          <h4>${pod.title}</h4>
          <p>${allTexts}</p>
          ${allImages.map((src) => `<img src="${src}" alt="${pod.title}" style="max-width:100%; margin-top:5px;">`).join("")}
        </div>
      `
    })

    return formattedAnswer
  } catch (error) {
    console.error(error)
    return null
  }
}

const getAIResponse = async (question) => {
  if (isMathExpression(question)) {
    try {
      // Using global math object from CDN
      const math = window.math
      const result = math.evaluate(question)
      return `<div class="math-answer">Answer: <strong>${result}</strong></div>`
    } catch (err) {
      const wolframAnswer = await getWolframAnswer(question)
      if (wolframAnswer) return wolframAnswer
      return `<div class="error">⚠️ Sorry, I couldn't evaluate this expression.</div>`
    }
  }

  const wolframAnswer = await getWolframAnswer(question)
  if (wolframAnswer) return wolframAnswer

  return getEducationalResponse(question)
}


const showElement = (id) => {
  const element = document.getElementById(id)
  if (element) {

    element.style.removeProperty("display")
    element.style.display = "block"
    element.style.visibility = "visible"

    element.classList.remove("hidden")

    console.log(`Showing element: ${id} - Current display: ${element.style.display}`)
    console.log(`Element computed style:`, window.getComputedStyle(element).display)
  } else {
    console.error(`Element not found: ${id}`)
  }
}

const hideElement = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.style.display = "none"
    element.style.visibility = "hidden"
    console.log(`Hiding element: ${id}`)
  } else {
    console.error(`Element not found: ${id}`)
  }
}

const showError = (message) => {
  const errorDiv = document.getElementById("error-message")
  const errorText = document.getElementById("error-text")
  if (errorDiv && errorText) {
    errorText.textContent = message
    errorDiv.style.display = "flex"
  }
}

const hideError = () => {
  const errorDiv = document.getElementById("error-message")
  if (errorDiv) {
    errorDiv.style.display = "none"
  }
}

const showDashboard = () => {
  console.log("=== SHOWING DASHBOARD ===")

  hideElement("loading-screen")
  hideElement("auth-container")

  const dashboard = document.getElementById("dashboard")
  if (dashboard) {

    dashboard.removeAttribute("style")

    dashboard.style.display = "block"
    dashboard.style.visibility = "visible"
    dashboard.style.opacity = "1"

    dashboard.classList.remove("hidden")
    dashboard.classList.add("visible")

    console.log("Dashboard element found and styled")
    console.log("Dashboard display:", dashboard.style.display)
    console.log("Dashboard computed display:", window.getComputedStyle(dashboard).display)
    console.log("Dashboard visibility:", dashboard.style.visibility)

    dashboard.offsetHeight

    setTimeout(() => {
      console.log("Dashboard check after 100ms:")
      console.log("Display:", window.getComputedStyle(dashboard).display)
      console.log("Visibility:", window.getComputedStyle(dashboard).visibility)
      console.log("Opacity:", window.getComputedStyle(dashboard).opacity)
    }, 100)
  } else {
    console.error("Dashboard element not found!")
  }
}

const showAuthContainer = () => {
  console.log("=== SHOWING AUTH CONTAINER ===")
  hideElement("loading-screen")
  hideElement("dashboard")

  const authContainer = document.getElementById("auth-container")
  if (authContainer) {
    authContainer.style.display = "block"
    authContainer.style.visibility = "visible"
    console.log("Auth container shown")
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatLastActive = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "Just now"
}

const getTrophyIcon = (index) => {
  if (index === 0) return "🥇"
  if (index === 1) return "🥈"
  if (index === 2) return "🥉"
  return `#${index + 1}`
}

const getRankClass = (index) => {
  if (index === 0) return "rank-gold"
  if (index === 1) return "rank-silver"
  if (index === 2) return "rank-bronze"
  return "rank-default"
}

const switchToLogin = () => {
  isLogin = true
  document.getElementById("login-tab").classList.add("active")
  document.getElementById("register-tab").classList.remove("active")
  document.getElementById("password").placeholder = "Enter your password"
  document.getElementById("password").setAttribute("autocomplete", "current-password")
  document.getElementById("auth-button-text").textContent = "Sign In"
  document.querySelector("#auth-submit i").className = "fas fa-sign-in-alt mr-2"


  const confirmGroup = document.getElementById("confirm-group")
  if (confirmGroup) {
    confirmGroup.style.display = "none"
  }

  hideError()
}

const switchToRegister = () => {
  isLogin = false
  document.getElementById("register-tab").classList.add("active")
  document.getElementById("login-tab").classList.remove("active")
  document.getElementById("password").placeholder = "Create a password"
  document.getElementById("password").setAttribute("autocomplete", "new-password")
  document.getElementById("auth-button-text").textContent = "Create Account"
  document.querySelector("#auth-submit i").className = "fas fa-user-plus mr-2"

  const confirmGroup = document.getElementById("confirm-group")
  if (confirmGroup) {
    confirmGroup.style.display = "block"
  }

  hideError()
}

async function handleAuth(e) {
  e.preventDefault()
  hideError()

  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const confirmPwd = document.getElementById("confirm-password")?.value
  const btn = document.getElementById("auth-submit")

  if (!isLogin && password !== confirmPwd) {
    showError("Passwords don't match")
    return
  }

  btn.disabled = true
  btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${isLogin ? "Signing in..." : "Creating account..."}`

  try {
    if (isLogin) {
      const userCredential = await auth.signInWithEmailAndPassword(email, password)
      console.log("Email sign-in successful:", userCredential.user.email)
    } else {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)
      console.log("Account created for:", user.email)
      await database.ref(`users/${user.uid}`).set({
        email: user.email,
        questionsAsked: 0,
        lastActive: Date.now(),
      })
    }

    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    if (document.getElementById("confirm-password")) {
      document.getElementById("confirm-password").value = ""
    }

    setTimeout(() => {
      console.log("Force showing dashboard after auth success")
      showDashboard()
    }, 500)
  } catch (err) {
    console.error("Auth error:", err)
    showError(err.message)
  }

  btn.disabled = false
  btn.innerHTML = `<i class="fas ${isLogin ? "fa-sign-in-alt" : "fa-user-plus"} mr-2"></i>${
    isLogin ? "Sign In" : "Create Account"
  }`
}

const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")

const resetGoogleButton = () => {
  const btn = document.getElementById("googleSignInBtn")
  if (btn) {
    btn.disabled = false
    btn.innerHTML = `<i class="fab fa-google mr-2"></i>Sign in / Sign up with Google`
  }
}

const handleGoogleSignIn = async () => {
  const btn = document.getElementById("googleSignInBtn")
  if (!btn) return

  btn.disabled = true
  btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Signing in with Google...`
  hideError()

  try {
    console.log("Starting Google sign-in with popup...")

    const result = await auth.signInWithPopup(googleProvider)
    const user = result.user

    console.log("Google sign-in successful:", user.email)

    const userSnapshot = await database.ref(`users/${user.uid}`).once("value")
    if (!userSnapshot.exists()) {
      console.log("Creating new user in database...")
      await database.ref(`users/${user.uid}`).set({
        email: user.email,
        questionsAsked: 0,
        lastActive: Date.now(),
      })
    } else {
      console.log("Updating existing user...")
      await database.ref(`users/${user.uid}`).update({
        lastActive: Date.now(),
      })
    }

    console.log("Google authentication completed successfully")
  } catch (err) {
    console.error("Google sign-in error:", err)

    if (err.code === "auth/popup-closed-by-user") {
      showError("Sign-in was cancelled. Please try again.")
    } else if (err.code === "auth/popup-blocked") {
      showError("Popup was blocked by your browser. Please allow popups and try again.")
    } else if (err.code === "auth/cancelled-popup-request") {
      showError("Another sign-in popup is already open.")
    } else {
      showError("Google sign-in failed: " + (err.message || "Unknown error"))
    }

    resetGoogleButton()
  }
}



async function logout() {
  try {
    console.log("Logging out...")
    await auth.signOut()
  } catch (err) {
    console.error("Error signing out:", err)
  }
}

const switchTab = (tabName) => {
  document.querySelectorAll(".nav-button").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")
  document.querySelectorAll(".question-section, .history-section, .leaderboard-section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(`${tabName}-section`).classList.add("active")
}

const submitQuestion = async (e) => {
  e.preventDefault()

  const questionInput = document.getElementById("question-input")
  const question = questionInput.value.trim()
  const submitBtn = document.getElementById("submit-question")

  if (!question || !currentUser) return

  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Answer...'

  try {
    const answer = await getAIResponse(question)

    const questionRef = database.ref("questions").push()
    await questionRef.set({
      question: question,
      answer: answer,
      timestamp: Date.now(),
      userId: currentUser.uid,
      userEmail: currentUser.email,
    })

    const userRef = database.ref(`users/${currentUser.uid}`)
    const userSnapshot = await userRef.once("value")
    const userData = userSnapshot.val() || {}
    const currentQuestions = userData.questionsAsked || 0

    await userRef.update({
      lastActive: Date.now(),
      questionsAsked: currentQuestions + 1,
    })

    questionInput.value = ""
    loadQuestionHistory()
    loadLeaderboard()
  } catch (error) {
    console.error("Error submitting question:", error)
    alert("Failed to submit question. Please try again.")
  }

  submitBtn.disabled = false
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Question'
}

const loadQuestionHistory = () => {
  if (!currentUser) return

  const questionsRef = database.ref("questions")
  questionsRef
    .orderByChild("userId")
    .equalTo(currentUser.uid)
    .on("value", (snapshot) => {
      const data = snapshot.val()
      const questionsList = document.getElementById("questions-list")
      const questionCount = document.getElementById("question-count")

      if (data) {
        const questions = Object.entries(data).map(([id, question]) => ({
          id,
          ...question,
        }))

        questions.sort((a, b) => b.timestamp - a.timestamp)

        questionCount.textContent = questions.length

        questionsList.innerHTML = questions
          .map(
            (q) => `
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
            `,
          )
          .join("")
      } else {
        questionCount.textContent = "0"
        questionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>No questions asked yet.</p>
                    <small>Start by asking your first question!</small>
                </div>
            `
      }
    })
}

const loadLeaderboard = () => {
  const usersRef = database.ref("users")
  usersRef.on("value", (snapshot) => {
    const data = snapshot.val()
    const usersList = document.getElementById("users-list")
    const totalUsers = document.getElementById("total-users")

    if (data) {
      const users = Object.entries(data).map(([id, user]) => ({
        id,
        ...user,
      }))

      users.sort((a, b) => {
        if (b.questionsAsked !== a.questionsAsked) {
          return b.questionsAsked - a.questionsAsked
        }
        return b.lastActive - a.lastActive
      })

      const topUsers = users.slice(0, 10) // Top 10 users
      totalUsers.textContent = users.length

      usersList.innerHTML = topUsers
        .map(
          (user, index) => `
                <div class="user-item ${getRankClass(index)}">
                    <div class="user-rank">
                        <span class="rank-icon">${getTrophyIcon(index)}</span>
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user.email?.split("@")[0] || "Anonymous"}</div>
                        <div class="user-activity">
                            <i class="fas fa-clock"></i>
                            <span>${formatLastActive(user.lastActive)}</span>
                        </div>
                    </div>
                    <div class="user-stats">
                        <span class="questions-badge">${user.questionsAsked || 0} questions</span>
                    </div>
                </div>
            `,
        )
        .join("")
    } else {
      totalUsers.textContent = "0"
      usersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>No active users yet.</p>
                </div>
            `
    }
  })
}


const setupAuthStateListener = () => {
  auth.onAuthStateChanged((user) => {
    console.log("=== AUTH STATE CHANGED ===")
    console.log("User:", user ? `${user.email} (${user.uid})` : "No user")

    if (user) {
      currentUser = user

      const userEmailElement = document.getElementById("user-email")
      if (userEmailElement) {
        userEmailElement.textContent = user.email
        console.log("Updated user email in UI:", user.email)
      }

      setTimeout(() => {
        console.log("Auth state: Forcing dashboard display")
        showDashboard()

 
        loadQuestionHistory()
        loadLeaderboard()
      }, 100)
    } else {
      currentUser = null
      console.log("Auth state: No user, showing auth container")
      showAuthContainer()
      resetGoogleButton()
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("=== DOM LOADED - INITIALIZING APP ===")

  const requiredElements = ["dashboard", "auth-container", "loading-screen"]
  requiredElements.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      console.log(`✓ Found element: ${id}`)
    } else {
      console.error(`✗ Missing element: ${id}`)
    }
  })

  document.getElementById("login-tab").addEventListener("click", switchToLogin)
  document.getElementById("register-tab").addEventListener("click", switchToRegister)

  document.getElementById("auth-form").addEventListener("submit", handleAuth)

  document.getElementById("googleSignInBtn").addEventListener("click", handleGoogleSignIn)

  document.getElementById("logout-btn").addEventListener("click", logout)

  document.getElementById("question-form").addEventListener("submit", submitQuestion)

  document.querySelectorAll(".nav-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab")
      switchTab(tab)
    })
  })

  setupAuthStateListener()

  setTimeout(() => {
    console.log("=== INITIAL LOAD TIMEOUT ===")
    hideElement("loading-screen")

    if (auth.currentUser) {
      console.log("User already authenticated:", auth.currentUser.email)
      showDashboard()
    } else {
      console.log("No authenticated user, showing auth")
      showAuthContainer()
    }
  }, 2000)
})

