import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import postService from '@/services/api/postService';
import ApperIcon from '@/components/ApperIcon';

const TrendingHashtags = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const trendData = await postService.getHashtagTrends();
        setTrends(trendData);
      } catch (err) {
        setError('Failed to load trending hashtags');
        console.error('Error fetching hashtag trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
    
    // Refresh trends every 5 minutes
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sparklineOptions = {
    chart: {
      type: 'line',
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#7C3AED'],
    tooltip: {
      enabled: false
    },
    grid: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg">Trending Hashtags</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-8 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="AlertCircle" size={20} className="text-error" />
          <h3 className="font-heading font-semibold text-lg">Trending Hashtags</h3>
        </div>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="TrendingUp" size={20} className="text-primary" />
        <h3 className="font-heading font-semibold text-lg">Trending Hashtags</h3>
      </div>
      
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <motion.div 
            key={trend.name}
            className="group cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 font-medium">{trend.name}</span>
                <ApperIcon 
                  name={trend.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                  className={trend.trend === 'up' ? 'text-success' : 'text-warning'} 
                />
              </div>
              <span className="text-xs text-gray-400">
                {trend.totalCount.toLocaleString()} posts
              </span>
            </div>
            
            <div className="h-8 w-full">
              <Chart
                options={sparklineOptions}
                series={[{
                  name: 'Posts',
                  data: trend.sparklineData
                }]}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {trends.length === 0 && (
        <div className="text-center py-4">
          <ApperIcon name="Hash" size={24} className="text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No trending hashtags yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default TrendingHashtags;