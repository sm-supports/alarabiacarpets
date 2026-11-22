# Lighthouse baseline

Clean build of `main` at `2f10125`, 2026-11-07. `npm run perf -- --runs=3`: Lighthouse 12.8.2
mobile preset (4x CPU slowdown, slow 4G), Chrome 156, served from `out/` by
`scripts/check-perf.mjs`. Each row is the run with the median LCP of three. All 8 pages
completed; none failed.

| Page | Score | FCP | LCP | Blocking time | CLS | Transferred | Scripts | Images | Requests |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 95 | 0.9 s | 2.3 s | 200 ms | 0.000 | 445 KB | 143 KB | 155 KB | 52 |
| `/ar` | 94 | 0.9 s | 3.1 s | 39 ms | 0.000 | 490 KB | 144 KB | 155 KB | 56 |
| `/products` | 97 | 0.9 s | 2.7 s | 31 ms | 0.000 | 956 KB | 157 KB | 606 KB | 56 |
| `/ar/products` | 93 | 0.9 s | 3.2 s | 17 ms | 0.000 | 1005 KB | 158 KB | 606 KB | 60 |
| `/contact` | 93 | 1.0 s | 2.4 s | 261 ms | 0.000 | 289 KB | 140 KB | 3 KB | 35 |
| `/products/carpet` | 93 | 0.9 s | 3.2 s | 81 ms | 0.000 | 560 KB | 147 KB | 257 KB | 47 |
| `/products/artificial-grass-installation-work` | 87 | 0.9 s | 4.0 s | 68 ms | 0.000 | 762 KB | 145 KB | 463 KB | 48 |
| `/services/wardrobes` | 96 | 0.9 s | 2.7 s | 12 ms | 0.000 | 368 KB | 146 KB | 67 KB | 47 |

## How much these move

Four more single runs of `/contact` straight afterwards, same build, same machine:

| Run | Score | LCP | Blocking time |
|---|---|---|---|
| 1 | 97 | 2.6 s | 70 ms |
| 2 | 77 | 2.8 s | 823 ms |
| 3 | 94 | 2.7 s | 174 ms |
| 4 | 97 | 2.5 s | 27 ms |

Blocking time ranged from 27 to 823 ms with nothing changed, so **acceptance item 11's
"`/contact` TBT within 10% of baseline" can't be judged from one number**. A real change has
to show up against that spread: compare several runs before and after, and go by the
median. LCP moved 2.4 to 2.8 s, about 8% either side, which is also close to the 10% limit.
CLS and bytes transferred didn't move at all, so those are the reliable comparisons.

Headless browsers from other sessions were running on this machine around the same time,
which may explain part of the spread.

The Google tag and Tawk load from the real internet in these runs, so their download times
are part of each result.
