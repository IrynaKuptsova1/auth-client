import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = (showAlert = false) => {
    localStorage.clear();
    if (showAlert) {
      sessionStorage.setItem("session_expired", "true");
    }
    window.location.href = "/sign-in";
  };

  useEffect(() => {
    const getEmail = async () => {
      try {
        const res = await fetchWithAuth("/me");

        if (res.ok) {
          const data = await res.json();
          setEmail(data.email || null);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Ошибка при получении профиля:", err);} finally {
        setLoading(false);
      }
    };

    getEmail();
  }, []);

  if (loading) {
    return (
      <div className="sign-in">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="sign-in">
      <div className="profile-card">
        <h1 className="profile-card__title">Welcome</h1>
        <div className="profile-card__info">
          <span className="profile-card__label">Logged in as:</span>
          <span className="profile-card__email">{email || "Unknown"}</span>
        </div>
        <button onClick={() => handleLogout(false)} className="btn btn-outline">
        Log out
        </button>
      </div>
    </div>
  );
}