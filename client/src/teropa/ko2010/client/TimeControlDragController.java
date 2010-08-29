package teropa.ko2010.client;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.allen_sauer.gwt.dnd.client.util.DOMUtil;
import com.allen_sauer.gwt.dnd.client.util.Location;
import com.allen_sauer.gwt.dnd.client.util.WidgetLocation;
import com.google.gwt.user.client.ui.AbsolutePanel;

public class TimeControlDragController extends PickupDragController {

	private final TimeControl ctrl;
	
	public TimeControlDragController(AbsolutePanel track, TimeControl ctrl) {
		super(track, true);
		this.ctrl = ctrl;
	}
	
	@Override
	public void dragMove() {
		super.dragMove();
		int loc = context.desiredDraggableX - getBoundaryOffsetX();
		loc = Math.max(0, loc);
		loc = Math.min(context.boundaryPanel.getOffsetWidth() - context.draggable.getOffsetWidth(), loc);
		ctrl.onKnobMoved(loc);		
	}

	private int getBoundaryOffsetX() {
		Location loc = new WidgetLocation(context.boundaryPanel, null);
		int left = loc.getLeft() + DOMUtil.getBorderLeft(context.boundaryPanel.getElement());
		return left;
	}
	
}
