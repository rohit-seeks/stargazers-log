const repositoryList = document.querySelector('#repository-list');
const repositoryStatus = document.querySelector('#repository-status');
const repositoryCount = document.querySelector('#repository-count');

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${dateString}T00:00:00`));
}

function createRepositoryItem(repository) {
  const item = document.createElement('li');
  item.className = 'repository-item';

  const titleRow = document.createElement('div');
  titleRow.className = 'repository-title-row';

  const link = document.createElement('a');
  link.className = 'repository-link';
  link.href = repository.website || repository.url || '#';
  link.textContent = repository.name;
  link.target = '_blank';
  link.rel = 'noreferrer';

  const date = document.createElement('time');
  date.dateTime = repository.starredAt;
  date.textContent = repository.website
    ? `Launched ${formatDate(repository.starredAt)}`
    : `Starred ${formatDate(repository.starredAt)}`;

  const fullName = document.createElement('p');
  fullName.className = 'repository-full-name';
  fullName.textContent = repository.fullName;

  const description = document.createElement('p');
  description.className = 'repository-description';
  description.textContent = repository.description;

  const meta = document.createElement('div');
  meta.className = 'repository-meta';

  const language = document.createElement('span');
  language.className = 'repository-language';
  language.textContent = repository.language;

  const site = document.createElement('span');
  site.textContent = repository.website ? 'Project website' : `${Number(repository.stars || 0).toLocaleString('en')} stars`;

  titleRow.append(link, date);
  meta.append(language, site);
  item.append(titleRow, fullName, description, meta);

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = `${repositories.length} projects`;
    repositoryStatus.textContent = repositories.length
      ? ''
      : 'No projects yet.';
  } catch (error) {
    repositoryStatus.textContent = 'Could not load project list. Please try again later.';
    console.error('Unable to load events.json:', error);
  }
}

loadRepositories();
