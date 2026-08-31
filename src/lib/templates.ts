import yourOrdersHtml from '../templates/yourorders.htm?raw';
import ordersHtml from '../templates/orderss.htm?raw';
import returnWindowHtml from '../templates/returnwindowclosess.htm?raw';
import emptyRatingsHtml from '../templates/emptyratings.htm?raw';
import sellerFeedbackHtml from '../templates/sellerfeedback.html?raw';

export interface TemplateEntry {
  id: string;
  name: string;
  description: string;
  html: string;
}

export const TEMPLATES: TemplateEntry[] = [
  {
    id: 'your-orders',
    name: 'Your Orders',
    description: 'Order history page with tracking, returns, and review links',
    html: yourOrdersHtml,
  },
  {
    id: 'orders',
    name: 'Orders List',
    description: 'Compact order list with buy-again and detail links',
    html: ordersHtml,
  },
  {
    id: 'return-window',
    name: 'Return Window Closed',
    description: 'Return-eligibility page with expired return window messaging',
    html: returnWindowHtml,
  },
  {
    id: 'empty-ratings',
    name: 'Empty Ratings',
    description: 'Review prompt page with star rating placeholders',
    html: emptyRatingsHtml,
  },
  {
    id: 'seller-feedback',
    name: 'Seller Feedback',
    description: 'Seller feedback form with rating and comment fields',
    html: sellerFeedbackHtml,
  },
];
