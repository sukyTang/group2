/*
Functions need to add: 
Show a hidden page when you press sign up button that shows input where you can put in email and availble date?
Inputable testimony, an in-class activity that people can participate in
*/

const homeBtn = document.getElementById('homeBtn');
const startBtn = document.getElementById('startBtn');
const disBtn = document.getElementById('disclaimerBtn');

const agenda = document.getElementsByClassName('agenda');
const resources = document.getElementsByClassName('resources');
const about = document.getElementsByClassName('about');

const topBtn = document.getElementsByClassName('toTop');

const navigation = document.getElementsByClassName('page');

window.onscroll = function () {
  scrollFunction()
};

// make script run after html doc has been completely parsed 
document.addEventListener('DOMContentLoaded', () => {
  // Takes care of the copyright mark at the bottom
  if (new Date().getFullYear() !== 2025) {
    document.getElementById('year').textContent = '-' + new Date().getFullYear();
  }

  // hides pages other than homepage
  for (i = 0; i < navigation.length; i++) {
    let page = navigation[i];
    if (page.id !== 'home') {
      page.style.display = 'none';
    }
  }

  /* startBtn?.addEventListener('click', (e) => {
    goToPage('workshop');
  }); */

  disBtn?.addEventListener('click', (e) => {
    goToPage('disclaimer');
  });

  homeBtn?.addEventListener('click', (e) => {
    goToPage('home');
  });

  // For everything in agenda and agenda drop-down, make it a button to go to agenda page
  for (let i = 0; i < agenda.length; i++) {
    agenda[i]?.addEventListener('click', (e) => {
      goToPage('agenda');

      const href = agenda[i].getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        setTimeout(() => {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }

  // for all buttons in resources dropdown and resource button, attach event listener to go ro resources page
  for (let i = 0; i < resources.length; i++) {
    resources[i]?.addEventListener('click', (e) => {
      goToPage('resources');
    });
  }
  /* resBtn?.addEventListener('click', (e) => {
    goToPage('resources');
  }); */
  for (let i = 0; i < about.length; i++) {
    about[i]?.addEventListener('click', (e) => {
      goToPage('about');
    });
  }

  // # quiz
  const quizForm = document.getElementById('quizForm');
  const quizResult = document.getElementById('quizResult');
  const answerKey = { q1: 'B', q2: 'A', q3: 'B', q4: 'C', q5: 'B' };
  // submit quiz button
  quizForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    let total = Object.keys(answerKey).length;
    for (const [q, correct] of Object.entries(answerKey)) {
      const picked = quizForm.querySelector(`input[name="${q}"]:checked`);
      if (picked && picked.value === correct) score++;
    }
    quizResult.textContent = `You scored ${score} / ${total}. ${score === total ? "Great job!" : "Review the Strategies and Communication sections, then try again."}`;
  });

  // #reflection
  const reflectionText = document.getElementById('reflectionText');
  const saveBtn = document.getElementById('saveReflection');
  const clearBtn = document.getElementById('clearReflection');
  // save reflection button eventlistener
  saveBtn?.addEventListener('click', () => {
    const text = reflectionText.value.trim();
    if (!text) { alert('Please write a short reflection first.'); return; }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reflection.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
  // clear reflection
  clearBtn?.addEventListener('click', () => { reflectionText.value = ''; });
});


// console.log(navigation);
function goToPage(page) {
  // Shows one page and hides other pages
  for (i = 0; i < navigation.length; i++) {
    //console.log(navigation[i].innerHTML.toLowerCase());
    let pageDiv = navigation[i];
    let pageName = pageDiv.id;
    //console.log("Page name: "+pageName+"; Page: "+pageDiv);

    if (pageName == page) {
      pageDiv.style.display = 'block';
      //console.log("shown"+page);
    }
    else {
      pageDiv.style.display = 'none';
      //console.log("hidden"+page);
    }
  }
}

function setTimer() {
  // Set the date we're counting down to
  var countDownDate = new Date();
}

function scrollFunction() {
  // console.log(topBtn);
  // https://stackoverflow.com/questions/70240526/how-to-prevent-scroll-to-top-button-from-going-over-the-footer
  let footerElement = document.getElementById('footer');
  let footerElementRect = footerElement.getBoundingClientRect();
  let mybuttonPositionBottom = topBtn[0].offsetTop + topBtn[0].offsetHeight;
  if (footerElementRect.y < mybuttonPositionBottom) {
    // if button is lower than footer.
    // modify css bottom.
    let diffheight = mybuttonPositionBottom - footerElementRect.y;
    let style = window.getComputedStyle(topBtn[0]);
    let addBottom = parseInt(style.getPropertyValue('bottom')) + diffheight;
    topBtn[0].style.bottom = addBottom + '10px'; // maybe add more 10 px for bottom space of a button.
  } else {
    // if button is heigher than footer. this including scroll up.
    // remove custom css bottom.
    topBtn[0].style.bottom = '';
  }

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    topBtn[0].classList.add('showTop');
  } else {
    topBtn[0].classList.remove('showTop');
  }
}