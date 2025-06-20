
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { DemoVideoSection } from '@/components/DemoVideoSection';
import { useRealtimeDeals } from '@/hooks/useRealtimeDeals';
import { ArrowRight, TrendingUp, Users, Shield, Clock } from 'lucide-react';

export const Home = () => {
  const { deals: latestDeals, isLoading } = useRealtimeDeals(6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Deals,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Save Money
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community to discover and share the best deals. Save money while helping others find amazing offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/deals">
                  Browse Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link to="/share-deal">Share Your Deal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Deals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Deals</h2>
            <p className="text-gray-600">Fresh deals added by our community</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestDeals.map((deal) => (
                <Card key={deal.id} className="group hover:shadow-lg transition-shadow duration-200">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {deal.image_url && (
                      <img
                        src={deal.image_url}
                        alt={deal.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{deal.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{deal.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      {deal.price && (
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${deal.price}
                          </span>
                          {deal.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${deal.original_price}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      Expires {new Date(deal.expiry_date).toLocaleDateString()}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/deal/${deal.id}`}>View Deal</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/deals">View All Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SplitClub?</h2>
            <p className="text-gray-600">Join thousands of savvy shoppers saving money together</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fresh Deals Daily</h3>
              <p className="text-gray-600">New deals added every day by our active community members</p>
            </Card>
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
              <p className="text-gray-600">Real deals shared by real people who want to help others save</p>
            </Card>
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified & Safe</h3>
              <p className="text-gray-600">All deals are moderated to ensure quality and authenticity</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <DemoVideoSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community today and discover amazing deals shared by people like you.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link to="/login">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
