import { useEffect, useState } from "react";
import { isNonEmptyString } from "../types";

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
      const currentToken = localStorage.getItem("accessToken");

      if (!isNonEmptyString(currentToken)) {
        handleLogout(false);
        return;
      }

      try {
        let res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (res.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!isNonEmptyString(refreshToken)) {
            handleLogout(true);
            return;
          }

          const refreshRes = await fetch(
            `${import.meta.env.VITE_API_URL}/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();

            if (
              isNonEmptyString(refreshData.accessToken) &&
              isNonEmptyString(refreshData.refreshToken)
            ) {
              localStorage.setItem("accessToken", refreshData.accessToken);
              localStorage.setItem("refreshToken", refreshData.refreshToken);

              res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
                headers: {
                  Authorization: `Bearer ${refreshData.accessToken}`,
                },
              });
            } else {
              handleLogout(true);
              return;
            }
          } else {
            handleLogout(true);
            return;
          }
        }

        if (res && res.ok) {
          const data = await res.json();
          setEmail(data.email || null);
        } else {
          handleLogout(false);
        }
      } catch (err) {
        console.error(err);
        handleLogout(false);
      } finally {
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
