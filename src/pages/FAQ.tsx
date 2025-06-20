
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const faqData = [
  {
    id: '1',
    question: 'What is SplitClub?',
    answer: 'SplitClub is a platform where users can share subscriptions, memberships, and other services to save money by splitting costs with others in the community.'
  },
  {
    id: '2',
    question: 'How do I share a deal?',
    answer: 'Click on "Share Deal" in the navigation bar, fill out the deal details including title, category, pricing, and availability, then publish it for others to claim.'
  },
  {
    id: '3',
    question: 'How do I claim a deal?',
    answer: 'Browse available deals, click on one that interests you, and click the "Claim" button. You\'ll need to be logged in to claim deals.'
  },
  {
    id: '4',
    question: 'Is it safe to share subscriptions?',
    answer: 'While we provide a platform for sharing, always check the terms of service of the service you\'re sharing to ensure compliance. We recommend only sharing with trusted community members.'
  },
  {
    id: '5',
    question: 'How do payments work?',
    answer: 'Payments are handled directly between users. The platform facilitates connections but doesn\'t process payments. Always use secure payment methods.'
  },
  {
    id: '6',
    question: 'Can I edit or delete my deals?',
    answer: 'Yes, you can edit or delete your shared deals from your profile page. Go to the "My Deals" section to manage your listings.'
  },
  {
    id: '7',
    question: 'What happens if a deal expires?',
    answer: 'Expired deals are automatically marked as inactive and won\'t appear in search results. You can extend or renew deals from your profile.'
  },
  {
    id: '8',
    question: 'How do I contact support?',
    answer: 'You can contact support through the Contact Us page, start a live chat, or send an email to support@splitclub.com.'
  }
];

export const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about SplitClub
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No FAQs found matching your search.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Button onClick={() => window.location.href = '/contact'}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};
