
const modules = [...document.querySelectorAll('.module')];
const buttons = [...document.querySelectorAll('.module-btn')];

const STORAGE_KEY = 'missionHistoire1792_v2';

let completed = [];

try {
  completed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(completed)) completed = [];
} catch {
  completed = [];
}

function showModule(index) {
  modules.forEach((module, i) => {
    module.classList.toggle('hidden', i !== index);
  });

  buttons.forEach((button, i) => {
    button.classList.toggle('active', i === index);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    showModule(Number(button.dataset.target));
  });
});

const explanations = {
  girondins:
    '<strong>Les Girondins :</strong> républicains modérés. Ils se méfient de la pression populaire parisienne et souhaitent donner davantage de poids aux départements. Ils sont favorables à la guerre contre les monarchies européennes.',

  montagnards:
    '<strong>Les Montagnards :</strong> républicains radicaux. Ils défendent une République forte et centralisée. Leurs principales figures sont Robespierre, Danton et Marat. Ils sont notamment soutenus par les sans-culottes.',

  plaine:
    '<strong>La Plaine :</strong> députés du centre, sans position politique homogène. Ils peuvent soutenir tantôt les Girondins, tantôt les Montagnards. Leur soutien peut faire basculer les votes.'
};

document.querySelectorAll('.explain-btn').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;
    document.getElementById('groupExplanation').innerHTML =
      explanations[group];
  });
});

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch (error) {
    console.warn('La progression ne peut pas être sauvegardée.');
  }
}

function updateProgress() {
  buttons.forEach((button, index) => {
    button.classList.toggle('done', completed.includes(index));
  });

  const percent = completed.length / modules.length * 100;

  document.getElementById('progressBar').style.width =
    percent + '%';

  document.getElementById('progressText').textContent =
    completed.length + ' / 5 modules';

  document.getElementById('progressMessage').textContent =
    completed.length === 5
      ? 'Félicitations ! Votre parcours est terminé.'
      : 'Continuez vos efforts pour terminer le parcours.';
}

function correctQuiz(quiz) {
  const questions = [...quiz.querySelectorAll('.question')];
  let score = 0;

  questions.forEach(question => {
    const answer = question.dataset.answer;
    const selected = question.querySelector('input:checked');

    question.classList.remove('is-correct', 'is-incorrect');

    const previous = question.querySelector('.correction');
    if (previous) previous.remove();

    if (selected && selected.value === answer) {
      score++;
      question.classList.add('is-correct');
    } else {
      question.classList.add('is-incorrect');
    }

    const correction = document.createElement('div');
    correction.className = 'correction';

    const isCorrect = selected && selected.value === answer;

    correction.innerHTML =
      (isCorrect ? '<strong>Bonne réponse.</strong> ' :
        '<strong>À revoir.</strong> ') +
      question.dataset.correction;

    question.appendChild(correction);
  });

  const result = quiz.querySelector('.quiz-result');
  const total = questions.length;
  const success = score === total;

  result.className = 'quiz-result ' +
    (success ? 'success' : 'retry');

  result.textContent = success
    ? `Bravo ! Vous avez obtenu ${score}/${total}. Module validé !`
    : `Vous avez obtenu ${score}/${total}. Consultez les corrections et réessayez.`;

  const moduleSection = quiz.closest('.module');
  const moduleIndex = Number(moduleSection.dataset.module);

  if (success && !completed.includes(moduleIndex)) {
    completed.push(moduleIndex);
    saveProgress();
    updateProgress();
  }

  if (quiz.dataset.quiz === 'module5') {
    const certificate = document.getElementById('certificate');
    certificate.classList.remove('hidden');

    certificate.textContent = success
      ? 'Félicitations ! Vous avez terminé les cinq modules et maîtrisé les grandes étapes de 1792 à 1804.'
      : 'Vous pouvez encore progresser. Consultez les corrections et reprenez les questions pour consolider vos connaissances.';
  }
}

document.querySelectorAll('.correction-btn').forEach(button => {
  button.addEventListener('click', () => {
    const quiz = button.closest('.quiz');
    correctQuiz(quiz);
  });
});

// Initialisation
updateProgress();
showModule(0);
