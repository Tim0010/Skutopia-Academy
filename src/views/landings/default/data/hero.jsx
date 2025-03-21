// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SECTION_PATH } from '@/path';

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Skutopia
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              The Success Academy
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
          icon={
            <CardMedia
              component="img"
              image="/assets/images/shared/celebration.svg"
              sx={{ width: 16, height: 16 }}
              alt="celebration"
              loading="lazy"
            />
          }
        />
      </>
    )
  },
  headLine: 'Learn from anywhere, anytime with Skutopia',
  captionLine: 'Learn STEM courses from the comfort of your home',
  primaryBtn: { children: 'Start Learning', href: SECTION_PATH },
  videoSrc: 'https://d2elhhoq00m1pj.cloudfront.net/saasable-intro.mp4',
  videoThumbnail: '/assets/videos/thumbnails/intro-thumbnail.png',
  listData: [
    { image: '/assets/images/shared/react.svg', title: 'Science' },
    { image: '/assets/images/shared/next-js.svg', title: 'Technology' },
    { image: '/assets/images/shared/material-ui.svg', title: 'Engineering' },
    { image: '/assets/images/shared/typescript.svg', title: 'Mathematics' },
    { image: '/assets/images/shared/m3.svg', title: 'Mentorship' },
  ]
};
