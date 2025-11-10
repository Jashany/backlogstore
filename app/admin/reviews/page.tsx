'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Package,
} from 'lucide-react';
import { AdminAuthService } from '@/lib/admin-auth';

interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    try {
      const token = AdminAuthService.getToken();
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/reviews`;

      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: number, isApproved: boolean) => {
    try {
      const token = AdminAuthService.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isApproved }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const deleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = AdminAuthService.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-zinc-400 text-sm">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const pendingCount = reviews.filter(r => !r.isApproved).length;
  const approvedCount = reviews.filter(r => r.isApproved).length;

  return (
    <div className="p-8 space-y-6 bg-zinc-950">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Reviews</h1>
        <p className="text-sm text-zinc-500">Moderate customer reviews and ratings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Reviews</p>
                <p className="text-2xl font-semibold text-white">{reviews.length}</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <Star className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Pending</p>
                <p className="text-2xl font-semibold text-white">{pendingCount}</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <XCircle className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Approved</p>
                <p className="text-2xl font-semibold text-white">{approvedCount}</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <CheckCircle className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-full focus:border-zinc-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(null)}
                className={filterStatus === null ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
                className={filterStatus === 'pending' ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
                className={filterStatus === 'approved' ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                Approved
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No reviews found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-white fill-white'
                                    : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className={review.isApproved ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-white mb-1">{review.title}</h3>
                        <p className="text-sm text-zinc-400 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {review.product.name}
                          </span>
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      {!review.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => updateReviewStatus(review.id, true)}
                          className="bg-white hover:bg-zinc-200 text-black"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.isApproved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReviewStatus(review.id, false)}
                          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Unapprove
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReview(review.id)}
                        className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>Showing {filteredReviews.length} of {reviews.length} reviews</p>
      </div>
    </div>
  );
}
