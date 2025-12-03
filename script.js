/*
Functions need to add: 
Show a hidden page when you press sign up button that shows input where you can put in email and availble date?
Inputable testimony, an in-class activity that people can participate in
*/

const homeBtn = document.getElementById('homeBtn');
const disBtn = document.getElementById('disclaimerBtn');

const popupBtn = document.getElementById('popUP');
const popupDiv = document.getElementById('popup');
const exitPopup = document.getElementById('exit');

const agenda = document.getElementsByClassName('agenda');
const resources = document.getElementsByClassName('resources');
const about = document.getElementsByClassName('about');

const topBtn = document.getElementsByClassName('toTop');

const navigation = document.getElementsByClassName('page');

const slides = document.getElementsByClassName('slideShow');
var slideNums = [0,0,0,0,0];

// Mobile navigation elements
const mobileHome = document.getElementById('mobileHome');
const mobileAgenda = document.getElementById('mobileAgenda');
const mobileResources = document.getElementById('mobileResources');
const mobileAbout = document.getElementById('mobileAbout');

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

  disBtn?.addEventListener('click', (e) => {
    goToPage('disclaimer');
  });

  homeBtn?.addEventListener('click', (e) => {
    goToPage('home');
  });

  popupBtn.addEventListener('click', showPopup);
  exitPopup.addEventListener('click', (e) => {
    popupDiv.style.visibility='hidden';
    document.getElementsByTagName('body')[0].style.overflowY = 'visible';
  })

  // When the Popup Test button is clicked, show the popup but switch to the test panel
  popupBtn.addEventListener('click', (e) => {
    // show overlay
    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
    popupDiv.style.visibility = 'visible';
    // show the test panel and hide the signup panel
    const testPanel = document.getElementById('popupTestPanel');
    const signupPanel = document.getElementById('popupSignup');
    if (testPanel) testPanel.style.display = 'block';
    if (signupPanel) signupPanel.style.display = 'none';
  });

  // Close any element with class 'close-popup'
  document.querySelectorAll('.close-popup').forEach(btn => btn.addEventListener('click', () => {
    popupDiv.style.visibility = 'hidden';
    document.getElementsByTagName('body')[0].style.overflowY = 'visible';
    // restore default panels
    const testPanel = document.getElementById('popupTestPanel');
    const signupPanel = document.getElementById('popupSignup');
    if (testPanel) testPanel.style.display = 'none';
    if (signupPanel) signupPanel.style.display = 'block';
  }));

  // Testimony popup wiring
  const testimonyBtn = document.getElementById('testimony');
  const testimonyPopup = document.getElementById('testimonyPopup');
  const testimonyForm = document.getElementById('testimonyForm');
  const closeTestimonyBtn = document.getElementById('closeTestimony');

  testimonyBtn?.addEventListener('click', (e) => {
    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
    if (testimonyPopup) testimonyPopup.style.visibility = 'visible';
  });

  closeTestimonyBtn?.addEventListener('click', (e) => {
    document.getElementsByTagName('body')[0].style.overflowY = 'visible';
    if (testimonyPopup) testimonyPopup.style.visibility = 'hidden';
  });

  testimonyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('testName').value.trim();
    const text = document.getElementById('testText').value.trim();
    if (!text) { alert('Please enter a testimony.'); return; }

    const stored = JSON.parse(localStorage.getItem('testimonies') || '[]');
    stored.push({ name: name || 'Anonymous', text, timestamp: new Date().toISOString() });
    localStorage.setItem('testimonies', JSON.stringify(stored));

    document.getElementsByTagName('body')[0].style.overflowY = 'visible';
    alert('Thank you — your testimony has been saved locally.');
    testimonyForm.reset();
    if (testimonyPopup) testimonyPopup.style.visibility = 'hidden';
  });

  // Popup Test form submit: save quick feedback to localStorage
  const popupTestForm = document.getElementById('popupTestForm');
  popupTestForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Collect intake fields
    const conflict = popupTestForm.querySelector('input[name="conflict"]:checked')?.value || null;
    const affected = document.getElementById('affected')?.value || null;
    const severity = document.getElementById('severity')?.value || null;
    const impactText = document.getElementById('impactText')?.value.trim() || '';
    const contactMe = popupTestForm.querySelector('input[name="contactMe"]:checked')?.value || 'no';
    const contactMethod = document.getElementById('contactMethod')?.value || null;
    const contactInfo = document.getElementById('contactInfo')?.value.trim() || null;

    // Validate required fields
    if (!conflict) { alert('Please indicate whether you are experiencing a conflict.'); return; }
    if (contactMe === 'yes' && !contactInfo) { alert('Please provide contact info so we can reach you.'); return; }

    const intake = JSON.parse(localStorage.getItem('clientIntake') || '[]');
    const entry = { conflict, affected, severity, impactText, contactMe, contactMethod, contactInfo, timestamp: new Date().toISOString() };
    intake.push(entry);
    localStorage.setItem('clientIntake', JSON.stringify(intake));

    // If user asked for contact or severity is high, display contact confirmation
    if (contactMe === 'yes' || severity === 'high' || conflict === 'yes') {
      alert('Thank you. Our team will review your submission and contact you shortly to discuss solutions.');
    } else {
      alert('Thank you. Your response has been recorded. If you change your mind, you can request contact later.');
    }

    // close popup and restore panels
    popupDiv.style.visibility = 'hidden';
    document.getElementsByTagName('body')[0].style.overflowY = 'visible';
    const testPanel = document.getElementById('popupTestPanel');
    const signupPanel = document.getElementById('popupSignup');
    if (testPanel) testPanel.style.display = 'none';
    if (signupPanel) signupPanel.style.display = 'block';
    popupTestForm.reset();
  });

  for (let i = 0; i < slides.length; i++) {
    // console.log(slides[i].getElementsByClassName('slide'));
    gotoSlide(slides[i], slideNums[i]);
    slides[i].querySelector('.next')?.addEventListener('click', slideShowBtn);
    slides[i].querySelector('.prev')?.addEventListener('click', slideShowBtn);
  }

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

  // for all buttons in resources dropdown and resource button, attach event listener to go to resources page
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

  // Mobile navigation event listeners
  mobileHome?.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage('home');
    updateMobileNav('mobileHome');
  });

  mobileAgenda?.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage('agenda');
    updateMobileNav('mobileAgenda');
  });

  mobileResources?.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage('resources');
    updateMobileNav('mobileResources');
  });

  mobileAbout?.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage('about');
    updateMobileNav('mobileAbout');
  });

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
  
  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update mobile nav active state
function updateMobileNav(activeId) {
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.classList.remove('active');
    if (item.id === activeId) {
      item.classList.add('active');
    }
  });
}

function setTimer() {
  // Set the date we're counting down to
  var countDownDate = new Date();
}

function slideShowBtn() {
  // gives the 'prev' and 'next' buttons in a slideshow actions

  slideShow = this.parentNode;
  theseSlides = slideShow.getElementsByClassName('slide');
  
  if (this.className == 'next') {
    // what to do if they press next
    if (slideNums[slideShow.id] < (theseSlides.length - 1)) {
      // what if uhh next slide is bigger than slide limit
      slideNums[slideShow.id]++;
    } else {
      slideNums[slideShow.id] = 0;
    }
  } else {
    // what to do if they press prev
    if (slideNums[slideShow.id] > 0) {
      // what if uhh next slide is bigger than slide limit
      slideNums[slideShow.id]--;
    } else {
      slideNums[slideShow.id] = (theseSlides.length - 1);
    }
  }
  gotoSlide(slideShow, slideNums[slideShow.id]);
  // console.log(slideNums);
}

function gotoSlide(slideShow, slide) {
  // hides the slide if it's not the current slide
  var mySlides = slideShow.getElementsByClassName('slide');
  var dots = slideShow.parentNode.getElementsByClassName('dot');
  var slideId = null
  for (i = 0; i < mySlides.length; i++) {
    if (mySlides[i].id == slide) {
      slideId = i;
      mySlides[i].style.display = 'block';
      dots[i].style.opacity = '100%';
    }
    else {
      mySlides[i].style.display = 'none';
      dots[i].style.opacity = '30%'
    }
  }
}

function showPopup() {
  // console.log('showpopup');
  
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  popupDiv.style.visibility = 'visible';
}

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    organization: document.getElementById('organization').value,
    session: document.getElementById('session').value,
    timestamp: new Date().toISOString()
  };

  // Get existing registrations or initialize empty array
  const registrations = JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
  registrations.push(formData);

  // Save back to localStorage
  localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));

  document.getElementsByTagName('body')[0].style.overflowY = 'visible';
  alert('Registration successful! Your information has been stored locally.');
  signupForm.reset();
  window.location.href = 'index.html';
});

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