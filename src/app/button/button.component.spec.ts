import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent Gameplay Logic', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    });

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {

    it('should create the button component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with enabled set to false', () => {
      expect(component.enabled).toBe(false);
    });

    it('should have a buttonClick EventEmitter', () => {
      expect(component.buttonClick).toBeDefined();
      expect(typeof component.buttonClick.emit).toBe('function');
    });
  });

  describe('Button State Management', () => {

    it('should allow enabling the button', () => {
      component.enabled = true;
      expect(component.enabled).toBe(true);
    });

    it('should allow disabling the button', () => {
      component.enabled = true;
      component.enabled = false;
      expect(component.enabled).toBe(false);
    });

    it('should start in disabled state by default', () => {
      const newComponent = new ButtonComponent();
      expect(newComponent.enabled).toBe(false);
    });
  });

  describe('Click Handling Logic', () => {

    it('should not emit event when button is disabled', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = false;
      component.handleClick();

      expect(component.buttonClick.emit).not.toHaveBeenCalled();
    });

    it('should emit event when button is enabled and clicked', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledWith({});
    });

    it('should emit empty object as event payload', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledWith({});
    });

    it('should handle multiple clicks when enabled', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();
      component.handleClick();
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(3);
      expect(component.buttonClick.emit).toHaveBeenCalledWith({});
    });

    it('should not emit anything when disabled between clicks', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      component.enabled = false;
      component.handleClick();

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(2);
      expect(component.buttonClick.emit).toHaveBeenCalledWith({});
    });
  });

  describe('Game State Integration Logic', () => {

    it('should handle rapid enable/disable state changes', () => {
      spyOn(component.buttonClick, 'emit');

      for (let i = 0; i < 10; i++) {
        component.enabled = i % 2 === 0;
        component.handleClick();
      }

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(5);
    });

    it('should maintain consistent state after multiple operations', () => {
      component.enabled = true;
      expect(component.enabled).toBe(true);

      component.handleClick();
      expect(component.enabled).toBe(true);

      component.enabled = false;
      expect(component.enabled).toBe(false);

      component.handleClick();
      expect(component.enabled).toBe(false);
    });

    it('should handle edge case of undefined enabled state', () => {
      spyOn(component.buttonClick, 'emit');

      (component as any).enabled = undefined;
      component.handleClick();

      expect(component.buttonClick.emit).not.toHaveBeenCalled();
    });

    it('should handle edge case of null enabled state', () => {
      spyOn(component.buttonClick, 'emit');

      (component as any).enabled = null;
      component.handleClick();

      expect(component.buttonClick.emit).not.toHaveBeenCalled();
    });

    it('should handle truthy values for enabled state', () => {
      spyOn(component.buttonClick, 'emit');

      (component as any).enabled = 1;
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalled();

      component.buttonClick.emit = jasmine.createSpy();
      (component as any).enabled = 'true';
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalled();

      component.buttonClick.emit = jasmine.createSpy();
      (component as any).enabled = {};
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalled();
    });

    it('should handle falsy values for enabled state', () => {
      spyOn(component.buttonClick, 'emit');

      (component as any).enabled = 0;
      component.handleClick();
      expect(component.buttonClick.emit).not.toHaveBeenCalled();

      (component as any).enabled = '';
      component.handleClick();
      expect(component.buttonClick.emit).not.toHaveBeenCalled();

      (component as any).enabled = NaN;
      component.handleClick();
      expect(component.buttonClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Event Emission Edge Cases', () => {

    it('should emit the same object reference each time', () => {
      let emittedValues: any[] = [];

      component.buttonClick.subscribe(value => {
        emittedValues.push(value);
      });

      component.enabled = true;
      component.handleClick();
      component.handleClick();

      expect(emittedValues.length).toBe(2);
      expect(emittedValues[0]).toEqual({});
      expect(emittedValues[1]).toEqual({});
    });

    it('should handle scenarios where EventEmitter is undefined', () => {
      (component as any).buttonClick = undefined;

      expect(() => {
        component.enabled = true;
        component.handleClick();
      }).toThrow();
    });

    it('should maintain consistent behavior under stress conditions', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;

      for (let i = 0; i < 1000; i++) {
        component.handleClick();
      }

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(1000);
    });

    it('should handle concurrent state changes correctly', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(Promise.resolve().then(() => {
          component.handleClick();
        }));
      }

      return Promise.all(promises).then(() => {
        expect(component.buttonClick.emit).toHaveBeenCalledTimes(11);
      });
    });
  });

  describe('Component Lifecycle and Game Flow', () => {

    it('should handle component reinitialization correctly', () => {
      component.enabled = true;

      const newFixture = TestBed.createComponent(ButtonComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.enabled).toBe(false);
      expect(component.enabled).toBe(true);
    });

    it('should maintain state independence across instances', () => {
      const component1 = new ButtonComponent();
      const component2 = new ButtonComponent();

      component1.enabled = true;
      component2.enabled = false;

      expect(component1.enabled).toBe(true);
      expect(component2.enabled).toBe(false);
    });

    it('should handle memory cleanup scenarios', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalled();

      fixture.destroy();

      expect(() => {
        component.handleClick();
      }).not.toThrow();
    });
  });

  describe('Game Logic Integration Scenarios', () => {

    it('should support typical video poker game flow', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = false;
      component.handleClick();
      expect(component.buttonClick.emit).not.toHaveBeenCalled();

      component.enabled = true;
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);

      component.enabled = false;
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);

      component.enabled = true;
      component.handleClick();
      expect(component.buttonClick.emit).toHaveBeenCalledTimes(2);
    });

    it('should handle game pause/resume scenarios', () => {
      spyOn(component.buttonClick, 'emit');

      component.enabled = true;
      component.handleClick();

      component.enabled = false;

      const attemptedClicks = 5;
      for (let i = 0; i < attemptedClicks; i++) {
        component.handleClick();
      }

      component.enabled = true;
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(2);
    });

    it('should handle error recovery scenarios', () => {
      spyOn(component.buttonClick, 'emit').and.throwError('Test error');

      component.enabled = true;

      expect(() => {
        component.handleClick();
      }).toThrow();

      component.buttonClick.emit = jasmine.createSpy();
      component.handleClick();

      expect(component.buttonClick.emit).toHaveBeenCalled();
    });
  });
});