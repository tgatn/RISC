import Route from '../models/Route';
import http from './Service';

const ChatService = {
  generative_ai: function(_id: string, option: string) {
    return http.post('/generative_ai', { _id, option });
  },

  
}

export default ChatService;