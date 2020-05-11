import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public requestChartType = 'pie';
  public requestChartDatasets: Array<any> = [
    { data: [17, 42, 24], label: 'Status comparison' }
  ];
  public requestChartLabels: Array<any> = ['Requested', 'Available', 'Reading'];
  public requestChartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870'],
      borderWidth: 2,
    }
  ];
  public requestChartOptions: any = {
    responsive: true
  };

  public chartType = 'line';
  public chartDatasets: Array<any> = [
    { data: [19, 15, 27, 28, 25, 31, 42], label: 'Books Registered' },
    { data: [19, 12, 17, 25, 24, 28, 32], label: 'New Users' },
  ];
  public chartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 255, 255, .2)',
      borderColor: 'rgba(242, 242, 242, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(255, 153, 153, .2)',
      borderColor: 'rgba(191, 191, 191, .7)',
      borderWidth: 2,
    }
  ];
  public receivedChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(166, 166, 166, 0.2)',
        },
        ticks: {
          fontColor: 'white',
        },
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(166, 166, 166, 0.2)',
        },
        ticks: {
          fontColor: 'white',
        },
      }]
    },
    legend: {
      labels: {
        fontColor: 'white',
      },
    }
  };


  public barChartType = 'bar';
  public barChartDatasets: Array<any> = [
    { data: [30, 19, 22, 17, 13, 18, 20, 18], label: 'Registered Books' }
  ];

  public barChartLabels: Array<any> = ['Lviv', 'Dnipro', 'Kyiv', 'Chernivtsi', 'Kharkiv', 'Rivne', 'Ivano-Frankivsk'];

  public barChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(40, 255, 20, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(40, 255, 20, 1)'
      ],
      borderWidth: 2,
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
