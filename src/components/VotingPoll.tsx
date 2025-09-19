import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Vote, Plus, Users, MapPin, Trophy, Calendar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type VotingPollProps = {
  onNavigate: (page: string) => void;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  destinations: string[];
  votes: { [key: string]: number };
  totalVotes: number;
  deadline: string;
  createdBy: string;
  status: 'active' | 'closed';
};

type UserVote = {
  pollId: string;
  destination: string;
  vote: number;
};

export function VotingPoll({ onNavigate }: VotingPollProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDestinations, setNewPollDestinations] = useState<string[]>(['']);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    // Mock data for demonstration
    const mockPolls: Poll[] = [
      {
        id: 'poll-1',
        title: 'Summer Trip 2024',
        description: 'Vote for our next group adventure!',
        destinations: ['Goa', 'Manali', 'Rishikesh', 'Udaipur'],
        votes: { 'Goa': 12, 'Manali': 8, 'Rishikesh': 15, 'Udaipur': 5 },
        totalVotes: 40,
        deadline: '2024-12-31',
        createdBy: 'Rahul',
        status: 'active'
      },
      {
        id: 'poll-2',
        title: 'Weekend Getaway',
        description: 'Quick 2-day trip options',
        destinations: ['Lonavala', 'Mahabaleshwar', 'Alibaug'],
        votes: { 'Lonavala': 6, 'Mahabaleshwar': 9, 'Alibaug': 3 },
        totalVotes: 18,
        deadline: '2024-12-25',
        createdBy: 'Priya',
        status: 'active'
      }
    ];
    setPolls(mockPolls);
  };

  const handleVote = async (pollId: string, destination: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please login to vote');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db77e5b0/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          pollId,
          destination,
          vote: 1
        })
      });

      if (response.ok) {
        // Update local state
        setPolls(polls.map(poll => {
          if (poll.id === pollId) {
            const newVotes = { ...poll.votes };
            newVotes[destination] = (newVotes[destination] || 0) + 1;
            return {
              ...poll,
              votes: newVotes,
              totalVotes: poll.totalVotes + 1
            };
          }
          return poll;
        }));

        // Track user vote
        setUserVotes([...userVotes.filter(v => v.pollId !== pollId), {
          pollId,
          destination,
          vote: 1
        }]);
      }
    } catch (error) {
      console.error('Voting error:', error);
    }
  };

  const addDestinationInput = () => {
    setNewPollDestinations([...newPollDestinations, '']);
  };

  const updateDestination = (index: number, value: string) => {
    const updated = [...newPollDestinations];
    updated[index] = value;
    setNewPollDestinations(updated);
  };

  const removeDestination = (index: number) => {
    setNewPollDestinations(newPollDestinations.filter((_, i) => i !== index));
  };

  const createPoll = async () => {
    if (!newPollTitle.trim() || newPollDestinations.filter(d => d.trim()).length < 2) {
      alert('Please provide a title and at least 2 destinations');
      return;
    }

    setLoading(true);
    
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      title: newPollTitle.trim(),
      description: 'Group voting poll',
      destinations: newPollDestinations.filter(d => d.trim()),
      votes: {},
      totalVotes: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'You',
      status: 'active'
    };

    // Initialize votes
    newPoll.destinations.forEach(dest => {
      newPoll.votes[dest] = 0;
    });

    setPolls([newPoll, ...polls]);
    setNewPollTitle('');
    setNewPollDestinations(['']);
    setShowCreatePoll(false);
    setLoading(false);
  };

  const getVotePercentage = (poll: Poll, destination: string) => {
    if (poll.totalVotes === 0) return 0;
    return ((poll.votes[destination] || 0) / poll.totalVotes) * 100;
  };

  const getWinningDestination = (poll: Poll) => {
    if (poll.totalVotes === 0) return null;
    return Object.entries(poll.votes).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const hasUserVoted = (pollId: string) => {
    return userVotes.some(vote => vote.pollId === pollId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <Vote className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl">Group Voting</h1>
              </div>
            </div>
            <Button
              onClick={() => setShowCreatePoll(!showCreatePoll)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Poll Form */}
        {showCreatePoll && (
          <Card className="mb-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle>Create New Poll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Poll title (e.g., Summer Trip 2024)"
                  value={newPollTitle}
                  onChange={(e) => setNewPollTitle(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <h4 className="mb-3">Destination Options</h4>
                <div className="space-y-2">
                  {newPollDestinations.map((destination, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder={`Destination ${index + 1}`}
                        value={destination}
                        onChange={(e) => updateDestination(index, e.target.value)}
                        className="flex-1"
                      />
                      {newPollDestinations.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDestination(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addDestinationInput}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={createPoll}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating...' : 'Create Poll'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePoll(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Polls */}
        <div className="space-y-6">
          <h2 className="text-2xl">Active Polls</h2>
          
          {polls.map((poll) => {
            const winningDestination = getWinningDestination(poll);
            const userHasVoted = hasUserVoted(poll.id);
            
            return (
              <Card key={poll.id} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{poll.title}</span>
                        {winningDestination && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Trophy className="h-3 w-3 mr-1" />
                            {winningDestination} leading
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{poll.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{poll.totalVotes} votes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Until {poll.deadline}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">by {poll.createdBy}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {poll.destinations.map((destination) => {
                      const votes = poll.votes[destination] || 0;
                      const percentage = getVotePercentage(poll, destination);
                      const isWinning = destination === winningDestination;
                      
                      return (
                        <div key={destination} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className={isWinning ? 'font-medium' : ''}>{destination}</span>
                              {isWinning && (
                                <Trophy className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">
                                {votes} votes ({percentage.toFixed(1)}%)
                              </span>
                              {!userHasVoted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVote(poll.id, destination)}
                                  className="h-8"
                                >
                                  Vote
                                </Button>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-2 ${isWinning ? 'bg-yellow-100' : ''}`}
                          />
                        </div>
                      );
                    })}
                    
                    {userHasVoted && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-700">✓ You've voted in this poll</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Voting Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">🗳️ How Group Voting Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Create polls with multiple destination options</p>
                <p className="mb-2">• Share poll links with your travel group</p>
              </div>
              <div>
                <p className="mb-2">• Everyone votes for their preferred destination</p>
                <p className="mb-2">• Winner is chosen democratically!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}