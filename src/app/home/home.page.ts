import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, LinearScale, BarController, BarElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  consumablesData: any[] = [];
  transceiverData: any[] = [];
  miniSASData: any[] = [];
  cat6Data: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }
    
    this.loadData('consumables', 'myChart');
    this.loadData('Transceiver', 'transceiverChart');
    this.loadData('MiniSAS', 'miniSASChart');
    this.loadData('Cat6', 'cat6Chart');
  }

  ngAfterViewInit() {
    Chart.register(
      LinearScale,
      BarController,
      BarElement,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );
  }

  loadData(collectionName: string, chartId: string) {
    this.firebaseService.getCollection(collectionName).subscribe(data => {
      switch (collectionName) {
        case 'consumables':
          this.consumablesData = data;
          break;
        case 'Transceiver':
          this.transceiverData = data;
          break;
        case 'MiniSAS':
          this.miniSASData = data;
          break;
        case 'Cat6':
          this.cat6Data = data;
          break;
      }
      this.createChart(chartId, data);
    });
  }

  createChart(chartId: string, data: any[]) {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;

    const allZeros = data.every(item => item.SubTotal === 0);

    const defaultData = data.map(item => {
      if (item.SubTotal > item.MaximumLevel) {
        return item.MaximumLevel;
      } else if (item.SubTotal < item.MinimumLevel) {
        return 0;
      } else {
        return item.SubTotal;
      }
    });

    const exceedData = data.map(item => {
      if (item.SubTotal > item.MaximumLevel) {
        return item.SubTotal - item.MaximumLevel;
      } else {
        return 0;
      }
    });

    const belowData = data.map(item => {
      if (item.SubTotal < item.MinimumLevel) {
        return item.SubTotal;
      } else {
        return 0;
      }
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.Consumable),
        datasets: [
          {
            label: 'Below Minimum Level',
            data: belowData,
            backgroundColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 1)', // Red
            borderColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
          },
          {
            label: 'Within Range',
            data: defaultData,
            backgroundColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(75, 192, 192, 0.2)', // Default color
            borderColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
          {
            label: 'Exceed Maximum Level',
            data: exceedData,
            backgroundColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 139, 1)', // Navy blue
            borderColor: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 139, 1)',
            borderWidth: 2,
          }
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              color: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 1)', // Red or default
            },
            grid: {
              color: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)' // Red or default
            }
          },
          x: {
            ticks: {
              color: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 1)', // Red or default
            },
            grid: {
              color: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)' // Red or default
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: allZeros ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 1)', // Red or default
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'textCenter',
        beforeDraw: function(chart) {
          if (allZeros) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            ctx.restore();
            ctx.font = '18px Arial';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            const text = 'There is no consumable, buy more';
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }
      }]
    });
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
