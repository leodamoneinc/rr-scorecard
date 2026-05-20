(function () {
    const $ = (id) => document.getElementById(id);

    // ─── URLs (REPLACE THESE WITH YOUR REAL KAJABI + AMAZON URLs) ──
    const BOOK_PREORDER_URL = "https://www.amazon.com"; // ← replace with Amazon pre-order link
    const BAND_URLS = {
      accessHolds:            "https://yourdomain.com/access-holds",
      accessHoldsSelectively: "https://yourdomain.com/access-holds-selectively",
      accessNarrows:          "https://yourdomain.com/access-narrows",
      accessClosesEarly:      "https://yourdomain.com/access-closes-early"
    };

    // ─── Constructs (5 constructs, 3 items each) ───────────────────
    // items: 0-indexed question positions in the questions array
    // reverseItems: which of those items are reverse-scored
    const constructs = [
      {
        name: "Threat Interpretation Sensitivity",
        shortName: "Threat Sensitivity",
        desc: "How readily you interpret uncertain situations through a threat lens",
        items: [0, 5, 10],
        reverseItems: [0, 5],
        focusCopy: "Your pattern suggests a tendency to interpret ambiguous situations through a threat lens. When pressure arrives, this can narrow the options that feel available before you've fully assessed what's actually in front of you."
      },
      {
        name: "Perceived Capability",
        shortName: "Perceived Capability",
        desc: "Your belief in your own ability to handle demanding situations",
        items: [1, 6, 11],
        reverseItems: [11],
        focusCopy: "Your pattern reflects lower confidence in your capacity to handle unexpected demands. This can create hesitation at the moment action is most needed — not because capability is absent, but because access to it is uncertain."
      },
      {
        name: "Perceived Control",
        shortName: "Perceived Control",
        desc: "Your sense of personal agency under pressure",
        items: [2, 7, 12],
        reverseItems: [12],
        focusCopy: "Your pattern suggests limited perceived agency under pressure. When the sense of control is low, motivation to adapt can reduce — and the mind can default to patterns that protect rather than respond."
      },
      {
        name: "Uncertainty Tolerance",
        shortName: "Uncertainty Tolerance",
        desc: "Your ability to function when information is incomplete",
        items: [3, 8, 13],
        reverseItems: [13],
        focusCopy: "Your pattern reflects difficulty functioning with incomplete information. Under pressure, the need for certainty before acting can create delays, avoidance, or premature commitment to narrow options."
      },
      {
        name: "Consequence Amplification",
        shortName: "Consequence Amplification",
        desc: "The tendency to amplify the perceived weight of potential negative outcomes",
        items: [4, 9, 14],
        reverseItems: [4, 9],
        focusCopy: "Your pattern reflects a tendency to amplify the perceived weight of potential negative outcomes. This extends the disruption window after high-pressure moments and can make recovery slower than the situation requires."
      }
    ];

    // ─── Questions (15 items, in presentation order) ──────────────
    // Order cycles through 5 constructs × 3 passes:
    // Pass 1: Q1=TIS, Q2=PC, Q3=PCon, Q4=UT, Q5=CA
    // Pass 2: Q6=TIS, Q7=PC, Q8=PCon, Q9=UT, Q10=CA
    // Pass 3: Q11=TIS, Q12=PC, Q13=PCon, Q14=UT, Q15=CA
    const questions = [
      // Q1 (idx 0) — TIS reverse
      "When I don't know how something will go, my mind goes to what could go wrong before what could go right.",
      // Q2 (idx 1) — PC forward
      "When something I didn't plan for shows up, I trust I can handle it.",
      // Q3 (idx 2) — PCon forward
      "When the stakes are high, I trust I can shape what happens next.",
      // Q4 (idx 3) — UT forward
      "I can decide and move even when I don't have every piece I want.",
      // Q5 (idx 4) — CA reverse
      "When I mess up, I worry the cost will follow me longer than it should.",
      // Q6 (idx 5) — TIS reverse
      "I rehearse what could go wrong before anything actually has.",
      // Q7 (idx 6) — PC forward
      "When new demands land, I trust I'll meet them.",
      // Q8 (idx 7) — PCon forward
      "Even in hard situations, I can see options I have.",
      // Q9 (idx 8) — UT forward
      "Acting before I have full clarity feels manageable to me.",
      // Q10 (idx 9) — CA reverse
      "When something matters, the weight of it can stop me from moving.",
      // Q11 (idx 10) — TIS forward
      "When I face the unknown, I can hold space for what might go right, not just what might go wrong.",
      // Q12 (idx 11) — PC reverse
      "When the demand is bigger than I expected, I question whether I have what it takes.",
      // Q13 (idx 12) — PCon reverse
      "In high-pressure moments, it feels like the situation is running me more than I am running it.",
      // Q14 (idx 13) — UT reverse
      "Until I have the full picture, I have a hard time committing to a direction.",
      // Q15 (idx 14) — CA forward
      "When something doesn't go the way I hoped, I trust I can recover from it without lasting damage."
    ];

    // Which construct does each question belong to (for label display)
    const questionConstructMap = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];

    // ─── State ────────────────────────────────────────────────────
    let currentQ = 0;
    const answers = [];

    // ─── Screen ───────────────────────────────────────────────────
    function showScreen(id) {
      ["pop-intro","pop-assessment","pop-results"].forEach(s => $(s).classList.remove("active"));
      $(id).classList.add("active");
      window.scrollTo(0,0);
    }

    // ─── Reverse score ────────────────────────────────────────────
    function reverseScore(raw) { return 5 - raw; }

    // ─── Transform raw answer for a given question ────────────────
    function transformedScore(qIdx, rawVal) {
      const cIdx = questionConstructMap[qIdx];
      const c = constructs[cIdx];
      return c.reverseItems.includes(qIdx) ? reverseScore(rawVal) : rawVal;
    }

    // ─── Construct score (3–12) ───────────────────────────────────
    function constructScore(cIdx) {
      const c = constructs[cIdx];
      return c.items.reduce((sum, qIdx) => sum + transformedScore(qIdx, answers[qIdx]), 0);
    }

    // ─── Construct strength label ─────────────────────────────────
    function constructLabel(score) {
      if (score >= 10) return "Strong";
      if (score >= 8)  return "Moderate";
      if (score >= 6)  return "Developing";
      return "Foundational";
    }

    // ─── Total score (15–60) ──────────────────────────────────────
    function totalScore() {
      return answers.reduce((sum, raw, qIdx) => sum + transformedScore(qIdx, raw), 0);
    }

    // ─── Band ─────────────────────────────────────────────────────
    function band(total) {
      if (total >= 48) return "accessHolds";
      if (total >= 38) return "accessHoldsSelectively";
      if (total >= 27) return "accessNarrows";
      return "accessClosesEarly";
    }

    // ─── Results copy (Access framing) ────────────────────────────
    const resultsCopy = {
      accessHolds: {
        name: "Access Holds",
        sub: "Your perception stays wide when pressure rises",
        meaning: "Your appraisal patterns hold wide across most domains. When pressure rises, perception tends to stay open — keeping options, clarity, and a sense of control accessible when it matters most. Patterns like this don't happen randomly. They were built through experience. They can be deepened further through structured training.",
        matters: "When access holds, decision quality stays intact under load, recovery time after disruption is shorter, and the way you show up for every person who needs something from you when stakes are highest carries weight they can feel. Patterns in this range are an asset — and they are worth understanding precisely.",
        gateHeadline: "You access wide. The next move is to deepen what's already working.",
        gateBody: "Your scorecard placed you in the band where access tends to hold under pressure. You've already built something most people are still searching for. The chapter that addresses your pattern shows you how to deepen it — and how to let it ripple to the people sharing space with you.",
        gateCta: "Send Me the Chapter + The 5-Day Training"
      },
      accessHoldsSelectively: {
        name: "Access Holds Selectively",
        sub: "Steady in some domains, narrowing in others",
        meaning: "Your appraisal patterns hold steady in some domains and narrow in others. When pressure rises, the constructs where your score is lowest are the ones most likely to reduce what feels available to you — options, clarity, and the sense that you can influence the outcome. This is the most common profile. It is also the most actionable.",
        matters: "Selective access means the gap between what you know and what you do under pressure is predictable — it shows up in specific situations, under specific conditions. That predictability is information. It tells you exactly where to train.",
        gateHeadline: "Your access holds in some places. The work is to widen the rest.",
        gateBody: "Your scorecard placed you in the most common — and most actionable — pattern. Stable in some domains, narrowing in others. The chapter that addresses your pattern shows you how to identify exactly where the narrowing happens, and the 5-day training begins shifting the access you already know is possible.",
        gateCta: "Send Me the Chapter + The 5-Day Training"
      },
      accessNarrows: {
        name: "Access Narrows",
        sub: "Pressure tightens the field before you respond",
        meaning: "Your appraisal patterns indicate elevated threat-framing or reduced capability beliefs in several areas. When pressure rises, perception may narrow predictably — reducing access to options, flexibility, and the sense of control before you've had the chance to fully assess what's actually in front of you. This pattern was built over time. It was not chosen. It can be trained.",
        matters: "Narrowing patterns often explain the gap between capability and execution under pressure. Intelligent, capable people with this profile know what to do — and still find that pressure changes what they can access. That is not a discipline problem. It is a perception and conditioning problem. It has a solution.",
        gateHeadline: "Your access narrows under pressure. That is information, not a verdict.",
        gateBody: "Your scorecard placed you in the band where pressure predictably narrows perception. This is not a discipline problem. It is a perception and conditioning problem — and it has a solution. The chapter that addresses your pattern shows you what's actually happening in the moment, and the 5-day training begins teaching the system to hold wider.",
        gateCta: "Send Me the Chapter + The 5-Day Training"
      },
      accessClosesEarly: {
        name: "Access Closes Early",
        sub: "Pressure closes the field before perception widens",
        meaning: "Your appraisal patterns indicate consistent threat-framing, lower capability beliefs, and high consequence amplification across most areas. Under even modest demand, perception likely narrows substantially — reducing the range of thinking available before a response is required. This pattern was not chosen. It was conditioned. Through environment, repetition, and experience accumulated long before awareness was possible. Because it was built, it can be rebuilt.",
        matters: "When access closes early, the gap between what a person knows and what they can access under pressure becomes significant and measurable. The cost shows up in decisions, relationships, and opportunities — not because of who you are, but because of how the system was trained. Structured training changes this. The book explains exactly how.",
        gateHeadline: "Your access closes early. Because it was built. Which means it can be rebuilt.",
        gateBody: "Your scorecard placed you in the band where pressure closes the field before perception has time to widen. This pattern was not chosen. It was conditioned — through environment, repetition, and experience accumulated long before awareness was possible. The chapter that addresses your pattern shows you why. The 5-day training shows you the first move.",
        gateCta: "Send Me the Chapter + The 5-Day Training"
      }
    };

    // ─── Rating scale ─────────────────────────────────────────────
    function createRatingScale() {
      const scale = $("pop-rating-scale");
      scale.innerHTML = "";
      for (let i = 1; i <= 4; i++) {
        const btn = document.createElement("button");
        btn.className = "rating-option";
        btn.type = "button";
        btn.textContent = i;
        btn.setAttribute("role","radio");
        btn.setAttribute("aria-checked","false");
        btn.setAttribute("aria-label", "Rating " + i + " of 4");
        btn.addEventListener("click", () => selectRating(i, btn));
        scale.appendChild(btn);
      }
    }

    function selectRating(val, el) {
      document.querySelectorAll("#pop-scorecard .rating-option").forEach(o => {
        o.classList.remove("selected");
        o.setAttribute("aria-checked","false");
      });
      el.classList.add("selected");
      el.setAttribute("aria-checked","true");
      answers[currentQ] = val;
      $("pop-next-btn").style.display = "inline-block";
    }

    // ─── Load question ────────────────────────────────────────────
    function loadQuestion() {
      $("pop-question-title").textContent = questions[currentQ];
      $("pop-progress-text").textContent = "Question " + (currentQ + 1) + " of " + questions.length;
      $("pop-progress-fill").style.width = (((currentQ + 1) / questions.length) * 100) + "%";

      const cIdx = questionConstructMap[currentQ];
      $("pop-construct-label").textContent = constructs[cIdx].shortName;

      $("pop-calibration-text").textContent =
        currentQ === 0 ? "Answer based on your last 14 days — not your best day." : "";

      createRatingScale();
      $("pop-back-btn").style.display = currentQ > 0 ? "inline-block" : "none";

      if (answers[currentQ] !== undefined) {
        const btns = $("pop-rating-scale").querySelectorAll(".rating-option");
        const t = btns[answers[currentQ] - 1];
        if (t) { t.classList.add("selected"); t.setAttribute("aria-checked","true"); }
        $("pop-next-btn").style.display = "inline-block";
      } else {
        $("pop-next-btn").style.display = "none";
      }
    }

    // ─── Render construct breakdown ───────────────────────────────
    function renderConstructBreakdown() {
      const container = $("pop-construct-breakdown");
      container.innerHTML = "";

      constructs.forEach((c, cIdx) => {
        const score = constructScore(cIdx);
        const label = constructLabel(score);
        const pct = ((score - 3) / 9) * 100; // 3-12 mapped to 0-100%

        const row = document.createElement("div");
        row.className = "construct-row";
        row.innerHTML =
          '<div class="construct-info">' +
            '<div class="construct-name">' + c.name + '</div>' +
            '<div class="construct-desc">' + c.desc + '</div>' +
            '<div class="construct-bar">' +
              '<div class="construct-bar-fill" style="width:' + pct + '%"></div>' +
            '</div>' +
          '</div>' +
          '<div class="construct-score-col">' +
            '<span class="construct-score-num">' + score + '/12</span>' +
            '<span class="construct-score-label">' + label + '</span>' +
          '</div>';
        container.appendChild(row);
      });
    }

    // ─── Render focus areas (two lowest constructs) ───────────────
    function renderFocusAreas() {
      const scores = constructs.map((c, i) => ({ i, score: constructScore(i) }));
      const sorted = [...scores].sort((a,b) => {
        if (a.score === b.score) return a.i - b.i;
        return a.score - b.score;
      });
      const lowest2 = sorted.slice(0,2);

      const container = $("pop-focus-areas");
      container.innerHTML = "";

      lowest2.forEach(({ i }) => {
        const c = constructs[i];
        const score = constructScore(i);
        const div = document.createElement("div");
        div.className = "focus-item";
        div.innerHTML =
          '<div class="focus-tag">Focus Area · ' + score + '/12</div>' +
          '<div class="focus-name">' + c.name + '</div>' +
          '<div class="focus-text">' + c.focusCopy + '</div>';
        container.appendChild(div);
      });
    }

    // ─── Supabase integration ─────────────────────────────────────
    const SUPABASE_EDGE_URL = 'https://xhropbhgwfjaqgcdotuy.supabase.co/functions/v1/submit-scorecard';

    // Converts the camelCase band key used internally by the Scorecard
    // into the snake_case string stored in the Supabase database
    const bandKeyToDbValue = {
      accessHolds:            'access_holds',
      accessHoldsSelectively: 'access_holds_selectively',
      accessNarrows:          'access_narrows',
      accessClosesEarly:      'access_closes_early'
    };

    function saveToSupabase(total, b) {
      try {
        fetch(SUPABASE_EDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q1:  answers[0],  q2:  answers[1],  q3:  answers[2],
            q4:  answers[3],  q5:  answers[4],  q6:  answers[5],
            q7:  answers[6],  q8:  answers[7],  q9:  answers[8],
            q10: answers[9],  q11: answers[10], q12: answers[11],
            q13: answers[12], q14: answers[13], q15: answers[14],
            tis_score:   constructScore(0),
            pc_score:    constructScore(1),
            pcon_score:  constructScore(2),
            ut_score:    constructScore(3),
            ca_score:    constructScore(4),
            total_score: total,
            band:        bandKeyToDbValue[b] || b,
            consent_given: true,
            program_type: 'public_scorecard'
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.result_token) {
            sessionStorage.setItem('pop_result_token', data.result_token);
          }
        })
        .catch(() => {});
      } catch(e) {}
    }

    // ─── Calculate and render results ─────────────────────────────
    function calculateResults() {
      const total = totalScore();
      const b = band(total);
      const copy = resultsCopy[b];

      $("pop-total-score").textContent = String(total);
      $("pop-band-name").textContent = copy.name;
      $("pop-band-sub").textContent = copy.sub;
      $("pop-meaning").textContent = copy.meaning;
      $("pop-matters").textContent = copy.matters;

      // Email gate (band-specific)
      $("pop-gate-headline").textContent = copy.gateHeadline;
      $("pop-gate-body").textContent = copy.gateBody;
      $("pop-gate-cta-text").textContent = copy.gateCta;

      renderConstructBreakdown();
      renderFocusAreas();

      // Wire up the email gate button — routes to band-specific Kajabi opt-in URL
      $("pop-gate-btn").onclick = () => {
        window.location.href = BAND_URLS[b];
      };

      // Wire up the secondary book link
      $("pop-book-link").href = BOOK_PREORDER_URL;

      saveToSupabase(total, b);
    }

    // ─── Navigation ───────────────────────────────────────────────
    function startAssessment() {
      showScreen("pop-assessment");
      currentQ = 0;
      loadQuestion();
    }

    function previousQuestion() {
      if (currentQ > 0) { currentQ--; loadQuestion(); }
    }

    function nextQuestion() {
      if (answers[currentQ] === undefined) return;
      currentQ++;
      if (currentQ < questions.length) { loadQuestion(); }
      else { calculateResults(); showScreen("pop-results"); }
    }

    // ─── Init ─────────────────────────────────────────────────────
    function init() {
      const s = $("pop-start-btn"), b = $("pop-back-btn"), n = $("pop-next-btn");
      if (!s || !b || !n) return false;
      s.addEventListener("click", startAssessment);
      b.addEventListener("click", previousQuestion);
      n.addEventListener("click", nextQuestion);
      $("pop-question-title").textContent = questions[0];
      return true;
    }

    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (init() || tries > 30) clearInterval(timer);
    }, 100);

  })();