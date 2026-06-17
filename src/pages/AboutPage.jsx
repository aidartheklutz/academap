import { Link } from "react-router";
import { CATEGORIES } from "../constants/categories";

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header__content">
          <Link
            to="/"
            className="about-header__back"
            aria-label="Назад к карте"
          >
            ← <span>Назад</span>
          </Link>
          <h1>О проекте Academap</h1>
        </div>
      </header>

      <main className="about-content">
        <div className="about-card animate-fade-in">
          <h1>Academap by Brynza</h1>
          <h3>Создано командой Brynza в рамках Shift Hackathon.</h3>
          <p>
            <b>Academap</b> - это карта возможностей для школьников и студентов
            Бишкека. С помощью неё они могут с лёгкостью искать различные
            академические активности благодаря удобному интерфейсу.
          </p>
          <p>
            На карте можно найти следующие категории мероприятий и событий:{" "}
          </p>
          <div className="about-categories-list">
            <p>
              <span class="material-symbols-outlined">clinical_notes</span>{" "}
              Олимпиады
            </p>
            <p>
              <span class="material-symbols-outlined">globe_asia</span> Модель
              ООН
            </p>
            <p>
              <span class="material-symbols-outlined">interpreter_mode</span>{" "}
              Конференция
            </p>
            <p>
              <span class="material-symbols-outlined">volunteer_activism</span>{" "}
              Волонтёрство
            </p>
            <p>
              <span class="material-symbols-outlined">work_history</span>{" "}
              Стажировка
            </p>
            <p>
              <span class="material-symbols-outlined">history_edu</span> Курсы
            </p>
            <p>
              <span class="material-symbols-outlined">movie</span> Киновстреча
            </p>
            <p>
              <span class="material-symbols-outlined">book_2</span> Книжный клуб
            </p>
            <p>
              <span class="material-symbols-outlined">globe_uk</span> English
              Talking Club
            </p>
            <p>
              <span class="material-symbols-outlined">person_raised_hand</span>{" "}
              Конкурс
            </p>
            <p>
              <span class="material-symbols-outlined">ink_pen</span> Тренинг
            </p>
            <p>
              <span class="material-symbols-outlined">co_present</span> Семинар
            </p>
            <p>
              <span class="material-symbols-outlined">handyman</span> Мастерская
            </p>
            <p>
              <span class="material-symbols-outlined">laptop_mac</span> Хакатон
            </p>
            <p>
              <span class="material-symbols-outlined">school</span> Лекция
            </p>
            <p>
              <span class="material-symbols-outlined">forum</span> Дебаты
            </p>
            <p>
              <span class="material-symbols-outlined">cases</span> Карьерная
              ярмарка
            </p>
            <p>
              <span class="material-symbols-outlined">credit_card_heart</span>{" "}
              Стипендия
            </p>
            <p>
              <span class="material-symbols-outlined">visibility</span> Выставка
            </p>
            <p className="about-categories-other">
              <span class="material-symbols-outlined">other_admission</span> И
              многое другое!
            </p>
          </div>
          <div
            className="about-logo-grid"
            aria-label="Логотипы Academap и Brynza"
          >
            <img
              className="about-logo-image"
              src="/academap-square.png"
              alt="Academap"
            />
            <img
              className="about-logo-image"
              src="/brynza_logo.png"
              alt="Brynza"
            />
          </div>
        </div>

        <footer className="about-footer">
          <p>Academap by Brynza.</p>
          <div className="about-socials">
            <a
              href="https://github.com/aidartheklutz/academap"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg className="social-icon-svg">
                <use href="/icons.svg#github-icon" />
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
