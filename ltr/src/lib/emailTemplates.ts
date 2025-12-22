export const welcomeTemplate = (userName: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4;color:#111">
    <h2 style="color:#0b5fff;margin-bottom:0.2em">Welcome to LocalPassengers, ${userName}!</h2>
    <p>We’re thrilled to have you onboard 🎉</p>
    <p>Save trains to receive real-time delay and reroute alerts directly to your inbox.</p>
    <p><a href="https://app.localpassengers.example" style="color:#0b5fff">Open your dashboard</a></p>
    <hr/>
    <small style="color:#666">This is an automated email. Please do not reply.</small>
  </div>
`;

export const rerouteTemplate = (userName: string, originalTrain: string, alternatives: {train: string; depart: string; notes?: string}[]) => `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4;color:#111">
    <h3>Hi ${userName}, important update for ${originalTrain}</h3>
    <p>We detected a delay for your saved train <strong>${originalTrain}</strong>. Here are suggested alternatives:</p>
    <ul>
      ${alternatives.map(a => `<li><strong>${a.train}</strong> — departs ${a.depart} ${a.notes ? `(${a.notes})` : ""}</li>`).join("")}
    </ul>
    <p>If you want us to automatically switch alerts to one of these alternatives, update your preferences in the dashboard.</p>
    <hr/>
    <small style="color:#666">This is an automated email from LocalPassengers.</small>
  </div>
`;
