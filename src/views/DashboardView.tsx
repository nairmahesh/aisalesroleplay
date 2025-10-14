import { TrendingUp, Clock, Target, Award, Lightbulb, ArrowRight } from 'lucide-react';

export function DashboardView() {
  const coachingSuggestions = [
    {
      title: 'Focus on Objections',
      description: 'Your last session showed difficulty with price objections. Challenge yourself with a prospect who is highly ROI-focused.',
      color: 'bg-rose-50 border-rose-200',
      textColor: 'text-rose-900',
      iconColor: 'text-rose-600',
      bot: 'Sarah Chen',
    },
    {
      title: 'New Challenge: Formal Personality',
      description: "You haven't practiced with a 'Formal' personality yet. Try a call to work on your professional tone and conciseness.",
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
      bot: 'Isabella Rodriguez',
    },
    {
      title: 'Strength to Build On: Talk Ratio',
      description: 'Your talk-to-listen ratio was excellent in your last call. Apply that skill to a "Nice" but busy prospect.',
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-900',
      iconColor: 'text-emerald-600',
      bot: 'Marcus Johnson',
    },
  ];

  const stats = [
    { label: 'Total Calls', value: '24', change: '+12%', icon: Clock },
    { label: 'Avg. Score', value: '78', change: '+5%', icon: Award },
    { label: 'Success Rate', value: '67%', change: '+8%', icon: Target },
    { label: 'Practice Hours', value: '8.5h', change: '+3h', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">AI Coach's Corner</h2>
        </div>
        <p className="text-slate-300 mb-6">
          Personalized recommendations based on your recent performance
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {coachingSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`${suggestion.color} border rounded-xl p-5 hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-5 h-5 ${suggestion.iconColor}`} />
                <h3 className={`font-bold ${suggestion.textColor}`}>{suggestion.title}</h3>
              </div>
              <p className={`text-sm mb-4 ${suggestion.textColor} opacity-90`}>
                {suggestion.description}
              </p>
              <button
                className={`flex items-center gap-2 ${suggestion.textColor} font-semibold text-sm hover:gap-3 transition-all`}
              >
                Practice with {suggestion.bot}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              bot: 'Marcus Johnson',
              date: '2 hours ago',
              score: 82,
              type: 'Cold Call',
              sentiment: 'Positive',
            },
            {
              bot: 'Sarah Chen',
              date: '1 day ago',
              score: 75,
              type: 'Discovery Call',
              sentiment: 'Neutral',
            },
            {
              bot: 'Emma Thompson',
              date: '2 days ago',
              score: 88,
              type: 'Warm Call',
              sentiment: 'Positive',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {activity.bot
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{activity.bot}</p>
                  <p className="text-sm text-slate-600">
                    {activity.type} • {activity.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    activity.sentiment === 'Positive'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {activity.sentiment}
                </span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{activity.score}</p>
                  <p className="text-xs text-slate-500">Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
