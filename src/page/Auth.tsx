import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { FileText, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const { error: authError } = isLogin
      ? await signIn(email, password)
      : await signUp(name, email, password, confirmPassword);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      window.location.href = '/builder';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-blue-100">Create professional resumes with AI assistance</p>
        </div>

        <Card>
          <CardBody className="p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-slate-400">
                {isLogin ? 'Sign in to your account' : 'Create your free account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  type="text"
                  label="Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'}</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </CardBody>
        </Card>

        <div className="mt-8 text-center text-blue-100 text-sm">
          <p>Build beautiful, ATS-friendly resumes in minutes</p>
        </div>
      </div>
    </div>
  );
};
